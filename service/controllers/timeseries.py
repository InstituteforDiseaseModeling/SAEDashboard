from pathlib import Path
import pandas as pd
import yaml
from service.helpers.dot_name import DotName, normalize_dot_name
from service.schemas.TimeseriesSchema import TimeseriesEstimatesList
from service.helpers.controller_helpers import DataFileKeys, read_dot_names, ControllerException, read_channel, read_subgroup, get_dataframe, read_shape_version, get_all_countries, resolve_version_for_country, aggregate_values
from service.helpers.indicator_metadata import aggregation_method
from fastapi import APIRouter, Request, HTTPException


router = APIRouter()

_config_path = Path(__file__).parent.parent / 'config.yaml'


@router.get("/timeseries", response_model=TimeseriesEstimatesList)
async def get_timeseries(request: Request):
    try:
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise ControllerException('indicators can only be requested for one dot_name at a time.')
        dot_name = DotName(dot_name_str=dot_names[0])
        channel = read_channel(request=request)
        subgroup = read_subgroup(request=request)
        shape_version = read_shape_version(request=request)

        all_countries_on_continent = dot_name.country is None
        countries = get_all_countries() if all_countries_on_continent else [dot_name.country]
        frames = []
        for country in countries:
            cv = resolve_version_for_country(country, channel, shape_version) if all_countries_on_continent else shape_version
            if cv is None:
                continue
            try:
                cdf = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=cv)
            except HTTPException:
                continue
            frames.append(cdf)
        if not frames:
            return []
        df = pd.concat(frames, ignore_index=True)
        exact = df.loc[df[DataFileKeys.DOT_NAME].map(normalize_dot_name) == normalize_dot_name(str(dot_name)), :]

        if exact.empty:
            all_dns = [DotName(dn) for dn in df[DataFileKeys.DOT_NAME].dropna().unique()]
            descendants = [dn for dn in all_dns if dn.is_descendant(dn=dot_name)]
            if descendants:
                level = min(dn.admin_level for dn in descendants)
                descendant_strs = [str(dn) for dn in descendants if dn.admin_level == level]
                df = df[df[DataFileKeys.DOT_NAME].isin(descendant_strs)].copy()
                group_cols = [DataFileKeys.YEAR]
                if 'month' in df.columns and df['month'].notnull().any():
                    group_cols.append('month')
                df = aggregate_values(df, group_cols, aggregation_method(channel))
                df[DataFileKeys.DOT_NAME] = str(dot_name)
            else:
                df = exact
        else:
            df = exact

        has_monthly_values = 'month' in df.columns and df['month'].notnull().any()

        years_with_months = set()
        if has_monthly_values:
            monthly_mask = df['month'].notnull() & (df['month'] != 'all')
            years_with_months = set(df.loc[monthly_mask, DataFileKeys.YEAR])

        with open(_config_path, "r") as f:
            config = yaml.safe_load(f)
        disaggregated_indicators = config.get("disaggregated_indicators", [])

        data = {}
        for _, row in df.iterrows():
            has_month = has_monthly_values and pd.notnull(row.get('month'))
            if has_month and row['month'] != 'all':
                entry = f"{row['month']} {row[DataFileKeys.YEAR]}"
            elif has_month and row['month'] == 'all' and row[DataFileKeys.YEAR] in years_with_months:
                continue
            else:
                entry = row[DataFileKeys.YEAR]

            data[entry] = {
                'year': row[DataFileKeys.YEAR],
                'lower_bound': row[DataFileKeys.DATA] if pd.isna(row[DataFileKeys.DATA_LOWER_BOUND]) else row[DataFileKeys.DATA_LOWER_BOUND],
                'middle': row[DataFileKeys.DATA],
                'upper_bound': row[DataFileKeys.DATA] if pd.isna(row[DataFileKeys.DATA_UPPER_BOUND]) else row[DataFileKeys.DATA_UPPER_BOUND]
            }

            if has_monthly_values and row['month'] != 'all':
                data[entry]['month'] = row['month']

            if channel in disaggregated_indicators:
                addl_data_columns = [col for col in df.columns if 'pred_' in col]
                data[entry]['others'] = {col.removeprefix('pred_'): row[col] for col in addl_data_columns}

            if DataFileKeys.REFERENCE in df.columns and pd.notna(row[DataFileKeys.REFERENCE]):
                data[entry]['reference_lower_bound'] = row.get(DataFileKeys.REFERENCE_LOWER_BOUND)
                data[entry]['reference_middle'] = row[DataFileKeys.REFERENCE]
                data[entry]['reference_upper_bound'] = row.get(DataFileKeys.REFERENCE_UPPER_BOUND)

        return list(data.values())
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
