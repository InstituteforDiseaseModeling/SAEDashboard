import pandas as pd
from helpers.dot_name import DotName
from schemas.TimeseriesSchema import TimeseriesEstimatesList
from service.helpers.controller_helpers import DataFileKeys, read_dot_names, ControllerException, read_channel, \
    read_subgroup, get_dataframe, read_shape_version
from fastapi import APIRouter, Request, HTTPException
import yaml
import os

router = APIRouter()

@router.get("/timeseries", response_model=TimeseriesEstimatesList)
async def get_timeseries(request: Request):
    """
    Retrieves annual (or monthly) indicator values over time for a specific region.

    This endpoint returns a time series of modeled or empirical values for a specified indicator
    (`channel`) and subgroup. The data is filtered by region (`dot_name`) and may include confidence
    bounds.

    For disaggregated indicators, the response includes an `others` field with sub-component
    estimates (e.g., species composition, or sub-categories). Some datasets also include
    reference benchmarks alongside the primary modeled values.

    Query Parameters:
        - dot_name (str): Hierarchical region identifier (e.g., "Africa:Senegal:Tambacounda").
                          Only one dot_name may be used per request.
        - channel (str): Name of the indicator (e.g., "model_predictions", "reported_incidence").
        - subgroup (str): Subgroup for which the indicator applies (e.g., "all").
        - shape_version (int): Version of the shapefile used for retrieving this indicator data (used for alignment with modeling data).

    Returns:
        list: A list of year-indexed indicator values, with optional `others`, `month`, and `reference_*` fields (if `indicator` and `se.indicator` fields used in data)

    Example 1:
    /timeseries?dot_name=Africa:Senegal:Tambacounda:Tambacounda&channel=model_predictions&subgroup=all&shape_version=2
    return:
        [
            {
                "year": 2019,
                "lower_bound": 333.5,
                "middle": 415.73,
                "upper_bound": 505.32
            },
            {
                "year": 2024,
                "lower_bound": 115.01,
                "middle": 172.19,
                "upper_bound": 223.37
            }
        ]

    Example 2:
    /timeseries?dot_name=Africa:Senegal:Kaffrine:Koungheul&channel=species_comp_gambiae&subgroup=all&shape_version=1
    return:
        [
            {
                "year": 2020,
                "lower_bound": 97.48778786,
                "middle": 97.48778786,
                "upper_bound": 97.48778786,
                "others": {
                    "nili": 0.0,
                    "pharoensis": 0.767620377,
                    "rufipes": 1.256106071,
                    "squamosus": 0.0,
                    "ziemanni": 0.348918353,
                    "coustani": 0.0,
                    "funestus": 0.139567341,
                    "stephensi": 0
                }
            },
            {
                "year": 2021,
                "lower_bound": 97.48778786,
                "middle": 97.48778786,
                "upper_bound": 97.48778786,
                "others": {
                    "nili": 0.0,
                    "pharoensis": 0.767620377,
                    "rufipes": 1.256106071,
                    "squamosus": 0.0,
                    "ziemanni": 0.348918353,
                    "coustani": 0.0,
                    "funestus": 0.139567341,
                    "stephensi": 0
                }
            },
            ...
        ]
    Example 3:
    /timeseries?dot_name=Africa:Senegal:Tambacounda:Tambacounda&channel=reported_incidence&subgroup=all&shape_version=1
    return:
        [
            {
                "year": 1996,
                "lower_bound": 0.047224601516542286,
                "middle": 0.08319512093600809,
                "upper_bound": 0.1394244789816742,
                "reference_lower_bound": 0.04796807558877803,
                "reference_middle": 0.07291666666666667,
                "reference_upper_bound": 0.09786525774455532
            },
            ...
        ]

    """

    try:
        # handle get arguments
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise ControllerException('indicators can only be requested for one dot_name at a time.')
        dot_name = DotName(dot_name_str=dot_names[0])
        channel = read_channel(request=request)
        subgroup = read_subgroup(request=request)
        shape_version = read_shape_version(request=request)

        df = get_dataframe(country=dot_name.country, channel=channel, subgroup=subgroup, version=shape_version)

        # limit data to the requested dot_name only
        df = df.loc[df[DataFileKeys.DOT_NAME].str.lower() == str(dot_name).lower(), :]

        # Flag to indicate whether data contains monthly values
        if 'month' in df.columns:
            has_monthly_values = df['month'].notnull().any()
        else:
            has_monthly_values = False

        data = {}

        # Extract the disaggregated indicator names
        full_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../config.yaml')
        with open(full_path, "r") as file:
            config = yaml.safe_load(file)
        disaggregated_indicators = config.get("disaggregated_indicators", [])

        for index, row in df.iterrows():
            if has_monthly_values and row['month'] != 'all':
                entry = "{} {}".format(row['month'], row[DataFileKeys.YEAR])
            elif has_monthly_values and row['month'] == 'all':
                continue
            else:
                entry = row[DataFileKeys.YEAR]

            data[entry] = {
                'year': row[DataFileKeys.YEAR],
                'lower_bound': row[DataFileKeys.DATA] if pd.isna(row[DataFileKeys.DATA_LOWER_BOUND]) else row[
                    DataFileKeys.DATA_LOWER_BOUND],
                'middle': row[DataFileKeys.DATA],
                'upper_bound': row[DataFileKeys.DATA] if pd.isna(row[DataFileKeys.DATA_UPPER_BOUND]) else row[
                    DataFileKeys.DATA_UPPER_BOUND]
            }

            if has_monthly_values and row['month'] != 'all':
                data[entry]['month'] = row['month']

            if channel in disaggregated_indicators:
                addl_data_columns = [col for col in df.columns if f'pred_' in col]

                disagg_data = {
                    col.removeprefix(f'pred_'): row[col] for col in addl_data_columns
                }

                data[entry]['others'] = disagg_data

            if pd.notna(row[DataFileKeys.REFERENCE]):
                data[entry]['reference_lower_bound'] = row[DataFileKeys.REFERENCE_LOWER_BOUND]
                data[entry]['reference_middle'] = row[DataFileKeys.REFERENCE]
                data[entry]['reference_upper_bound'] = row[DataFileKeys.REFERENCE_UPPER_BOUND]

        return list(data.values())

    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise  # re-raise deliberate FastAPI exceptions
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
