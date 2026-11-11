from pathlib import Path
import pandas as pd
import yaml
from fastapi import APIRouter, Request, HTTPException
from service.helpers.dot_name import DotName, normalize_dot_name
from service.helpers.controller_helpers import (
    read_dot_names, read_subgroup, read_channel, read_year, read_month, read_data,
    read_admin_level, ControllerException, get_all_countries, get_dataframe, DataFileKeys,
    read_shape_version, load_geojson_pickle, get_shape_filename, resolve_version_for_country,
    aggregate_values,
)
from service.helpers.indicator_metadata import aggregation_method
from service.schemas.MapSchema import MapListSchema


def _build_shape_lookup(shape_data):
    norm_to_canon = {}
    for k in shape_data:
        norm_to_canon[normalize_dot_name(k)] = k
        suffix = k.rsplit(':', 1)[-1]
        norm_suffix = normalize_dot_name(suffix)
        if norm_suffix not in norm_to_canon:
            norm_to_canon[norm_suffix] = k
    return norm_to_canon


def _resolve_dot_name(dn, shape_lookup):
    if not shape_lookup:
        return dn
    norm = normalize_dot_name(dn)
    if norm in shape_lookup:
        return shape_lookup[norm]
    suffix = dn.rsplit(':', 1)[-1]
    norm_suffix = normalize_dot_name(suffix)
    if norm_suffix in shape_lookup:
        return shape_lookup[norm_suffix]
    return dn


router = APIRouter()

_config_path = Path(__file__).parent.parent / 'config.yaml'
with open(_config_path, "r") as f:
    CONFIG = yaml.safe_load(f)
DISAGGREGATED_INDICATORS = CONFIG.get("disaggregated_indicators", [])


@router.get("/map", response_model=MapListSchema)
async def get_map(request: Request):
    try:
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

        countries = get_all_countries() if dot_name.country is None else [dot_name.country]
        all_countries_on_continent = dot_name.country is None
        return_list = []

        for country in countries:
            cv = resolve_version_for_country(country, channel, shape_version) if all_countries_on_continent else shape_version
            if cv is None:
                continue
            try:
                df = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=cv)
            except HTTPException:
                continue
            parent_dn = DotName.from_parts([dot_name.continent, country]) if all_countries_on_continent else dot_name

            all_dot_names = [DotName(dn) for dn in df[DataFileKeys.DOT_NAME].dropna().unique()]
            valid_dot_names = [
                str(dn) for dn in all_dot_names
                if dn.is_descendant_or_self(parent_dn) and dn.admin_level == requested_admin_level
            ]
            df = df[df[DataFileKeys.DOT_NAME].isin(valid_dot_names) & (df[DataFileKeys.YEAR] == year)].copy()

            if df.empty:
                deeper_dot_names = [
                    dn for dn in all_dot_names
                    if dn.is_descendant_or_self(parent_dn) and dn.admin_level > requested_admin_level
                ]
                if deeper_dot_names:
                    level = min(dn.admin_level for dn in deeper_dot_names)
                    deeper_strs = [str(dn) for dn in deeper_dot_names if dn.admin_level == level]
                    df = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=cv)
                    df = df[df[DataFileKeys.DOT_NAME].isin(deeper_strs) & (df[DataFileKeys.YEAR] == year)].copy()

                    has_month = 'month' in df.columns and df['month'].notnull().any()
                    if has_month:
                        df[DataFileKeys.MONTH] = df[DataFileKeys.MONTH].astype(str)
                        if month is not None:
                            df = df[df[DataFileKeys.MONTH] == str(month)]
                        elif 'all' in df[DataFileKeys.MONTH].values:
                            df = df[df[DataFileKeys.MONTH] == 'all']

                    df['_parent'] = df[DataFileKeys.DOT_NAME].apply(
                        lambda dn: ':'.join(dn.split(':')[:requested_admin_level + 2])
                    )

                    shape_fn = get_shape_filename(parent_dn, requested_admin_level, cv)
                    shape_data = load_geojson_pickle(shape_fn) if shape_fn else None
                    shape_lookup = _build_shape_lookup(shape_data) if shape_data else None
                    if shape_lookup:
                        df['_parent'] = df['_parent'].apply(
                            lambda p: _resolve_dot_name(p, shape_lookup)
                        )

                    group_cols = ['_parent']
                    if has_month:
                        group_cols.append(DataFileKeys.MONTH)
                    df = aggregate_values(df, group_cols, aggregation_method(channel))
                    df = df.rename(columns={'_parent': DataFileKeys.DOT_NAME})

            if 'month' in df.columns and df['month'].notnull().any():
                df[DataFileKeys.MONTH] = df[DataFileKeys.MONTH].astype(str)
                if month is not None:
                    df = df[df[DataFileKeys.MONTH] == str(month)]
                elif 'all' in df[DataFileKeys.MONTH].values:
                    df = df[df[DataFileKeys.MONTH] == 'all']

            if channel in DISAGGREGATED_INDICATORS:
                addl_data_columns = [col for col in df.columns if 'pred_' in col]
                new_values = []
                for _, row in df.iterrows():
                    new_values.append({
                        'id': row[DataFileKeys.DOT_NAME],
                        'value': row[data_key],
                        'data_upper_bound': row['data_upper_bound'],
                        'data_lower_bound': row['data_lower_bound'],
                        'others': {col.removeprefix('pred_'): row[col] for col in addl_data_columns}
                    })
            else:
                new_values = df[[DataFileKeys.DOT_NAME, data_key, 'data_lower_bound', 'data_upper_bound']].rename(
                    columns={DataFileKeys.DOT_NAME: 'id', data_key: 'value'}).to_dict('records')

            for record in new_values:
                if pd.isna(record.get('value')):
                    continue
                if pd.isna(record.get('data_lower_bound')):
                    record['data_lower_bound'] = record['value']
                if pd.isna(record.get('data_upper_bound')):
                    record['data_upper_bound'] = record['value']
                return_list.append(record)

        return return_list
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
