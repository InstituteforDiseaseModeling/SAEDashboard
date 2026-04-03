import math
import pandas as pd
import yaml
import os
from fastapi import APIRouter, Request, HTTPException
from helpers.dot_name import DotName
from helpers.controller_helpers import read_dot_names, read_subgroup, read_channel, read_year, read_month, read_data, \
    read_admin_level, ControllerException, get_all_countries, get_dataframe, DataFileKeys, read_shape_version
from schemas.MapSchema import MapListSchema

router = APIRouter()

# Load disaggregated indicators once at module level
_config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../config.yaml')
with open(_config_path, "r") as f:
    CONFIG = yaml.safe_load(f)

DISAGGREGATED_INDICATORS = CONFIG.get("disaggregated_indicators", [])


@router.get("/map", response_model=MapListSchema)
async def get_map(request: Request):
    """
    Retrieves spatial indicator values by administrative region.

    This endpoint returns modeled or empirical values for a specified indicator
    across subnational regions, filtered by region, year, administrative level, and subgroup.
    It supports both scalar indicators and disaggregated indicators.

    The response format is dynamically chosen based on the indicator type:
    - Simple indicators return a list of `{id, value, data_lower_bound, data_upper_bound}`.
    - Disaggregated indicators additionally return `others` — a dictionary of values for non-primary attributes.

    Query Parameters:
        - dot_name (str): A hierarchical geographic identifier (e.g., "Africa:Benin").
                          Only one value is allowed per request.
        - channel (str): The name of the indicator (e.g., "predicted_incidence").
        - subgroup (str): A population subgroup for particular analysis (e.g., "15-24_urban").
        - year (int): The target year for data retrieval (e.g., 2022).
        - month (int, optional): If the dataset supports monthly disaggregation, filters to that month.
        - data (str): The name of the data column to return (e.g., "data (pred)", "data_upper_bound (pred_upper)", or "data_lower_bound (pred_lower)").
        - version (int, optional): Shapefile version for geometry matching (only necessary if an indicator has data files for two different shapefile versions)
        - admin_level (int): The level of geographic resolution to return (e.g., 2 = admin1; 3=admin2).

    Returns:
        list: A list of region-level indicator values with uncertainty bounds and optional disaggregates.

    Example 1: /map?dot_name=Africa:Senegal&channel=tpr&subgroup=all&year=2024&data=data&admin_level=3&shape_version=1
    return:
        [
            {
                "id": "Africa:Senegal:Dakar:Centre",
                "value": 2.259887006,
                "data_lower_bound": 2.259887006,
                "data_upper_bound": 2.259887006
            },
            {
                "id": "Africa:Senegal:Dakar:Centre",
                "value": 2.54801293,
                "data_lower_bound": 2.54801293,
                "data_upper_bound": 2.54801293
            },
            ...
        ]

    Example 2: /map?dot_name=Africa:Senegal&channel=species_comp_gambiae&subgroup=all&year=2023&data=data&admin_level=3&shape_version=1
    return:
        [
            {
                "id": "Africa:Senegal:Saint-Louis:Dagana",
                "value": 29.7188755,
                "data_lower_bound": 29.7188755,
                "data_upper_bound": 29.7188755,
                "others": {
                    "nili": 0.0,
                    "pharoensis": 16.86746988,
                    "rufipes": 2.409638554,
                    "squamosus": 0.0,
                    "ziemanni": 22.89156627,
                    "coustani": 0.0,
                    "funestus": 28.1124498,
                    "stephensi": 0.0
                }
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
        year = read_year(request=request)
        month = read_month(request=request)
        data_key = read_data(request=request)
        shape_version = read_shape_version(request=request)
        requested_admin_level = read_admin_level(request=request)

        if requested_admin_level < dot_name.admin_level:
            raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

        # Handle the case where continent-level dot_name is provided, too
        countries = get_all_countries() if dot_name.country is None else [dot_name.country]
        all_countries_on_continent = dot_name.country is None

        return_list = []

        for country in countries:
            df = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=shape_version)
            parent_dn = DotName.from_parts([dot_name.continent, country]) if all_countries_on_continent else dot_name

            # Filter to descendants at the requested admin level
            all_dot_names = [DotName(dn) for dn in df[DataFileKeys.DOT_NAME].dropna().unique()]
            valid_dot_names = [
                str(dn) for dn in all_dot_names
                if dn.is_descendant_or_self(parent_dn) and dn.admin_level == requested_admin_level
            ]
            df = df[df[DataFileKeys.DOT_NAME].isin(valid_dot_names) & (df[DataFileKeys.YEAR] == year)]

            # Make a copy to avoid chained assignment warnings
            df = df.copy()

            # Handle month filtering if applicable
            if 'month' in df.columns and df['month'].notnull().any():
                df[DataFileKeys.MONTH] = df[DataFileKeys.MONTH].astype(str)
                if month is not None:
                    df = df[df[DataFileKeys.MONTH] == str(month)]
                elif 'all' in df[DataFileKeys.MONTH].values:
                    df = df[df[DataFileKeys.MONTH] == 'all']


            # Format results
            if channel in DISAGGREGATED_INDICATORS:
                addl_data_columns = [col for col in df.columns if f'pred_' in col]

                new_values = []
                for _, row in df.iterrows():
                    entry = {
                        'id': row[DataFileKeys.DOT_NAME],
                        'value': row[data_key],
                        'data_upper_bound': row['data_upper_bound'],
                        'data_lower_bound': row['data_lower_bound'],
                        'others': {
                            col.removeprefix(f'pred_'): str(row[col]) if pd.notna(row[col]) else "" for col in addl_data_columns
                        }
                    }
                    new_values.append(entry)
            else:
                # update the return with the newly found entries
                new_values = df[[DataFileKeys.DOT_NAME, data_key, 'data_lower_bound', 'data_upper_bound']].rename(
                    columns={DataFileKeys.DOT_NAME: 'id', data_key: 'value'}, inplace=False).to_dict('records')

            # Drop records with non-finite values (NaN/inf are not JSON-serializable)
            filtered_values = []
            for record in new_values:
                val = record['value']
                if isinstance(val, float) and not math.isfinite(val):
                    continue
                lb = record['data_lower_bound']
                if pd.isna(lb):
                    record['data_lower_bound'] = val
                elif isinstance(lb, float) and not math.isfinite(lb):
                    record['data_lower_bound'] = val
                ub = record['data_upper_bound']
                if pd.isna(ub):
                    record['data_upper_bound'] = val
                elif isinstance(ub, float) and not math.isfinite(ub):
                    record['data_upper_bound'] = val
                filtered_values.append(record)
            new_values = filtered_values

            return_list.extend(new_values)

        return return_list

    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise  # re-raise deliberate FastAPI exceptions
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
