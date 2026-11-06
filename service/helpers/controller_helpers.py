import hashlib
import json
import os
from glob import glob
from pathlib import Path
from fastapi import HTTPException
import pandas as pd
import pickle
import re

from service.helpers.dot_name import DotName, normalize_dot_name

DATA_CACHE = {}
SHAPE_CACHE = {}


def clear_data_cache(filename=None):
    if filename:
        DATA_CACHE.pop(os.path.join(data_dir, filename), None)
    else:
        DATA_CACHE.clear()


MASTER_DATA_FILE_REGEX = re.compile(
    r'^(?P<country>.+)__(?P<channel>.+)__(?P<subgroup>.+)__(?P<version>.+)\.csv$')

MASTER_SHAPE_FILE_REGEX = re.compile(
    r'^(?P<country>.+)__l(?P<level>\d+)__(?P<version>\d+)\.shp.pickle$')

TRUTHY = ['true', 'True', 'yes']


class DataFileKeys:
    DOT_NAME = 'dot_name'
    REFERENCE = 'reference'
    REFERENCE_LOWER_BOUND = 'reference_lower_bound'
    REFERENCE_UPPER_BOUND = 'reference_upper_bound'
    DATA = 'data'
    DATA_LOWER_BOUND = 'data_lower_bound'
    DATA_UPPER_BOUND = 'data_upper_bound'
    YEAR = 'year'
    MONTH = 'month'


VALUE_COLUMNS = (DataFileKeys.DATA, DataFileKeys.DATA_LOWER_BOUND, DataFileKeys.DATA_UPPER_BOUND,
                 DataFileKeys.REFERENCE, DataFileKeys.REFERENCE_LOWER_BOUND, DataFileKeys.REFERENCE_UPPER_BOUND)


def aggregate_values(df, group_cols, how):
    numeric = set(df.select_dtypes(include='number').columns)
    value_cols = [c for c in VALUE_COLUMNS if c in df.columns and c in numeric]
    grouped = df.groupby(group_cols, as_index=False, dropna=False)[value_cols]
    return grouped.sum(min_count=1) if how == 'sum' else grouped.mean()


current_dir = os.path.dirname(os.path.abspath(__file__))
data_root = os.path.join(current_dir, '..', 'data')
data_root = os.path.join(data_root, 'latest') if os.getenv('SAE_AKS') else data_root
data_dir = os.path.join(data_root, 'data')
shape_dir = os.path.join(data_root, 'shapefiles')


class ControllerException(Exception):
    pass


APP_CONFIG_PATH = os.path.join(current_dir, '..', 'app_config.json')
_APP_CONFIG_CACHE = {}


def load_app_config():
    if not _APP_CONFIG_CACHE:
        try:
            with open(APP_CONFIG_PATH, 'r', encoding='utf-8') as f:
                config = json.load(f)
        except (OSError, json.JSONDecodeError):
            raise HTTPException(status_code=500,
                                detail="Application config file is missing or malformed.")
        if (not isinstance(config, dict)
                or not isinstance(config.get('app'), dict)
                or not isinstance(config.get('indicators'), dict)):
            raise HTTPException(status_code=500,
                                detail="Application config is invalid: expected top-level "
                                       "'app' and 'indicators' objects.")
        _APP_CONFIG_CACHE['config'] = config
    return _APP_CONFIG_CACHE['config']


def clear_config_cache():
    _APP_CONFIG_CACHE.clear()


def get_app_config():
    return load_app_config()['app']


def get_all_indicator_configs():
    from service.helpers.indicator_metadata import get_all_metadata, DISPLAY_FIELD_MAP
    indicators = dict(load_app_config()['indicators'])
    for ind_id, meta in get_all_metadata().items():
        entry = dict(indicators.get(ind_id) or {
            "theme": "RdBu",
            "shapefileVersion": 1,
            "unitLabel": "value",
            "multiper": 1,
            "unit": "",
            "mapLabel": "",
            "legendLabel": meta.get("display_name", ind_id),
            "decimalPt": 2,
        })
        if meta.get("color_theme") is not None:
            entry["theme"] = meta["color_theme"]
        if meta.get("shape_version") is not None:
            entry["shapefileVersion"] = int(meta["shape_version"])
        for src, dst in DISPLAY_FIELD_MAP.items():
            if src in meta:
                entry[dst] = meta[src]
        indicators[ind_id] = entry
    return indicators


def get_indicator_config(indicator):
    indicators = get_all_indicator_configs()
    if indicator not in indicators:
        raise ControllerException(f"Unknown indicator: {indicator}")
    return indicators[indicator]


def detect_shape_versions(country):
    regex = re.compile(r'^%s__l(?P<admin_level>.+)__(?P<version>.+)\.shp\.pickle$' % country, re.IGNORECASE)
    country_datafiles = {}
    for fn in os.listdir(shape_dir):
        match_obj = regex.match(fn)
        if match_obj is not None:
            country_datafiles[match_obj['version']] = match_obj.string
    return list(country_datafiles.keys())


def extract_info_from_filename(filename: str):
    match = MASTER_DATA_FILE_REGEX.match(filename)
    return match["country"], match["channel"], match["subgroup"], match["version"]


def extract_shape_info_from_filename(filename: str):
    match = MASTER_SHAPE_FILE_REGEX.match(filename)
    if match:
        return match["country"], match["level"], match["version"]
    return None, None, None


def get_data_filenames(country=None, channel=None, subgroup=None, version=None):
    regex_str = r'^%s__%s__%s__%s\.csv$'
    country_pattern = r'(?P<country>.+)' if country is None else re.escape(str(country))
    channel_pattern = r'(?P<channel>.+)' if channel is None else re.escape(str(channel))
    subgroup_pattern = r'(?P<subgroup>.+)' if subgroup is None else re.escape(str(subgroup))
    version_pattern = r'(?P<version>.+)' if version is None else re.escape(str(version))
    regex = re.compile(regex_str % (country_pattern, channel_pattern, subgroup_pattern, version_pattern), re.IGNORECASE)
    try:
        matches = [regex.match(fn) for fn in os.listdir(data_dir)]
    except FileNotFoundError:
        return []
    return [m for m in matches if m is not None]


def get_all_countries():
    countries = set()
    for m in get_data_filenames():
        countries.add(m['country'])
    return list(countries)


def get_all_countries_for_shapes():
    countries = set()
    for filename in glob(os.path.join(shape_dir, "*.pickle")):
        country, _, _ = extract_shape_info_from_filename(os.path.basename(filename))
        if country is not None:
            countries.add(country)
    return list(countries)


def get_child_dot_names(parent_dot_name):
    all_countries = parent_dot_name.admin_level == -1
    if all_countries:
        return [DotName.from_parts([parent_dot_name.continent, country]) for country in get_all_countries()]
    dot_names = {}
    for filename_match in get_data_filenames(country=parent_dot_name.country):
        df = open_data_file(filename=os.path.join(data_dir, filename_match.string))
        for dot_name in df[DataFileKeys.DOT_NAME]:
            dot_names[dot_name] = DotName(dot_name_str=dot_name)
    return [dn for dn in dot_names.values() if parent_dot_name.generational_distance(dn) == -1]


def get_subgroups(dot_name, channel=None, version=None, use_descendent_dot_names=False, admin_level=None):
    use_descendent_dot_names = True if admin_level is not None else use_descendent_dot_names
    filename_matches = get_data_filenames(country=dot_name.country, channel=channel, version=version)
    subgroups = set()
    for m in filename_matches:
        df = open_data_file(filename=m.string)
        if use_descendent_dot_names:
            data_dot_names = [DotName(dot_name_str=dn) for dn in df[DataFileKeys.DOT_NAME].unique()]
            if admin_level is None:
                compare = lambda dn: dn.is_descendant_or_self(dn=dot_name)
            else:
                compare = lambda dn: dn.is_descendant_or_self(dn=dot_name) and dn.admin_level >= admin_level
            if any(compare(ddn) for ddn in data_dot_names):
                subgroups.add(m['subgroup'])
        else:
            if normalize_dot_name(str(dot_name)) in df[DataFileKeys.DOT_NAME].map(normalize_dot_name).values:
                subgroups.add(m['subgroup'])
    return list(subgroups)


def get_channels(dot_name, subgroup=None, version=None, use_descendent_dot_names=False, admin_level=None):
    use_descendent_dot_names = True if admin_level is not None else use_descendent_dot_names
    filename_matches = get_data_filenames(country=dot_name.country, subgroup=subgroup, version=version)
    channels = set()
    for m in filename_matches:
        df = open_data_file(filename=m.string)
        if use_descendent_dot_names:
            data_dot_names = [DotName(dot_name_str=dn) for dn in df[DataFileKeys.DOT_NAME].unique()]
            if admin_level is None:
                compare = lambda dn: dn.is_descendant_or_self(dn=dot_name)
            else:
                compare = lambda dn: dn.is_descendant_or_self(dn=dot_name) and dn.admin_level >= admin_level
            if any(compare(ddn) for ddn in data_dot_names):
                channels.add(m['channel'])
        else:
            if normalize_dot_name(str(dot_name)) in df[DataFileKeys.DOT_NAME].map(normalize_dot_name).values:
                channels.add(m['channel'])
    return list(channels)


def _aggregate_all_subgroups(country, channel, version):
    from service.helpers.indicator_metadata import aggregation_method
    how = aggregation_method(channel)
    cache_key = f"__all__{country}__{channel}__{version}__{how}"
    if cache_key in DATA_CACHE:
        return DATA_CACHE[cache_key]
    matches = get_data_filenames(country=country, channel=channel, version=version)
    frames = []
    for m in matches:
        if m['subgroup'] != 'all':
            frames.append(open_data_file(filename=m.string))
    if not frames:
        raise HTTPException(status_code=400, detail=f"No subgroup files for {country} / {channel}")
    combined = pd.concat(frames, ignore_index=True)
    group_cols = [DataFileKeys.DOT_NAME]
    if DataFileKeys.YEAR in combined.columns:
        group_cols.append(DataFileKeys.YEAR)
    if DataFileKeys.MONTH in combined.columns:
        group_cols.append(DataFileKeys.MONTH)
    df = aggregate_values(combined, group_cols, how)
    DATA_CACHE[cache_key] = df
    return df


def get_dataframe(country, channel, subgroup, version):
    regex_str = rf'^{re.escape(str(country))}__{re.escape(str(channel))}__{re.escape(str(subgroup))}__{re.escape(str(version))}\.csv$'
    regex = re.compile(regex_str, re.IGNORECASE)
    try:
        matches = [regex.match(fn) for fn in os.listdir(data_dir) if regex.match(fn)]
    except FileNotFoundError:
        matches = []
    if len(matches) == 0:
        if str(subgroup) == 'all':
            return _aggregate_all_subgroups(country, channel, version)
        raise HTTPException(status_code=400, detail=f"No matching file for {country} / {channel} / {subgroup} / v{version}")
    if len(matches) > 1:
        raise HTTPException(status_code=400, detail=f"Multiple files match {country} / {channel} / {subgroup} / v{version}")
    return open_data_file(matches[0].string)


def get_indicator_version(country, channel):
    regex = re.compile(rf'^{re.escape(country)}__{re.escape(channel)}__.+__(?P<version>\d+)\.csv$', re.IGNORECASE)
    versions = set()
    try:
        for fn in os.listdir(data_dir):
            match = regex.match(fn)
            if match:
                versions.add(int(match.group("version")))
    except FileNotFoundError:
        pass
    if len(versions) == 0:
        raise HTTPException(status_code=400, detail=f"No versions found for {country} / {channel}")
    if len(versions) > 1:
        raise HTTPException(status_code=400, detail=f"More than one shapefile version for {channel}: {sorted(versions)}")
    return str(next(iter(versions)))


def resolve_version_for_country(country, channel, fallback_version):
    try:
        return get_indicator_version(country, channel)
    except HTTPException:
        available = detect_shape_versions(country)
        if str(fallback_version) in available:
            return str(fallback_version)
        return None


def get_indicator_admin_levels(country, channel, version):
    admin_levels = set()
    matches = get_data_filenames(country=country, channel=channel, version=version)
    for file in matches:
        df = open_data_file(filename=file.string)
        depths = (df['dot_name'].str.split(':').apply(len) - 2).unique()
        for d in depths:
            for lvl in range(1, int(d) + 1):
                admin_levels.add(lvl)
    return admin_levels


def get_indicator_subgroups(country, channel, version):
    regex_str = r'^%s__%s__(?P<subgroup>.+)__%s\.csv$'
    country_pattern = re.escape(country) if country else r'(?P<country>.+)'
    channel_pattern = re.escape(channel) if channel else r'(?P<channel>.+)'
    version_pattern = re.escape(str(version)) if version else r'(?P<version>.+)'
    regex = re.compile(regex_str % (country_pattern, channel_pattern, version_pattern), re.IGNORECASE)
    try:
        matches = [regex.match(fn) for fn in os.listdir(data_dir)]
    except FileNotFoundError:
        return []
    return [m.group('subgroup') for m in matches if m]


def get_indicator_time(country, channel, subgroup, version):
    time_dict = {}
    df = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=version)
    if DataFileKeys.MONTH in df.columns:
        year_month_dict = df.groupby(DataFileKeys.YEAR)[DataFileKeys.MONTH].unique().to_dict()
        for year, months in year_month_dict.items():
            if pd.isna(months[0]):
                time_dict[year] = []
            else:
                months = list(months)
                if 'all' in months:
                    months = [x for x in months if x != 'all']
                time_dict[year] = months
    else:
        years = df[DataFileKeys.YEAR].unique()
        time_dict = {year: [] for year in years}
    return time_dict


def open_data_file(filename, use_cache=True):
    full_path = os.path.join(data_dir, filename)
    if use_cache:
        cached_df = DATA_CACHE.get(full_path, None)
        if cached_df is not None:
            return cached_df

    channel = MASTER_DATA_FILE_REGEX.match(os.path.basename(filename))['channel']
    df = pd.read_csv(full_path)
    df = df.rename(columns={
        'state': DataFileKeys.DOT_NAME,
        channel: DataFileKeys.REFERENCE,
        'se.' + channel: 'reference_stderr',
        'pred': DataFileKeys.DATA,
        'pred_upper': DataFileKeys.DATA_UPPER_BOUND,
        'pred_lower': DataFileKeys.DATA_LOWER_BOUND
    })

    if 'reference_stderr' in df.columns:
        ci_multiplier = 1.96
        df[DataFileKeys.REFERENCE_LOWER_BOUND] = df[DataFileKeys.REFERENCE] - df['reference_stderr'] * ci_multiplier
        df[DataFileKeys.REFERENCE_UPPER_BOUND] = df[DataFileKeys.REFERENCE] + df['reference_stderr'] * ci_multiplier
        df = df.drop(columns='reference_stderr')
    else:
        df[DataFileKeys.REFERENCE_LOWER_BOUND] = None
        df[DataFileKeys.REFERENCE_UPPER_BOUND] = None
        if DataFileKeys.REFERENCE not in df.columns:
            df[DataFileKeys.REFERENCE] = None

    DATA_CACHE[full_path] = df
    return df


def load_geojson_pickle(pickle_filename, use_cache=True):
    if pickle_filename is None:
        return None
    full_path = os.path.join(shape_dir, pickle_filename)
    if use_cache:
        cached = SHAPE_CACHE.get(full_path, None)
        if cached is not None:
            return cached
    try:
        with open(full_path, 'rb') as f:
            geojson_dicts = pickle.load(f)
    except FileNotFoundError:
        return None
    SHAPE_CACHE[full_path] = geojson_dicts
    return geojson_dicts


def get_shape_filenames(country=None, admin_level=None, version=None):
    regex_str = r'^%s__l%s__%s\.shp.pickle$'
    country_pattern = r'(?P<country>.+)' if country is None else re.escape(str(country))
    admin_pattern = r'(?P<admin_level>\d+)' if admin_level is None else re.escape(str(admin_level))
    version_pattern = r'(?P<version>\d+)' if version is None else re.escape(str(version))
    regex = re.compile(regex_str % (country_pattern, admin_pattern, version_pattern), re.IGNORECASE)
    try:
        matches = [regex.match(fn) for fn in os.listdir(shape_dir)]
    except FileNotFoundError:
        return []
    return [m for m in matches if m is not None]


def get_shape_info(country=None, admin_level=None, version=None, include_admin_names=False):
    results = []
    for m in get_shape_filenames(country=country, admin_level=admin_level, version=version):
        c, lvl, ver = m["country"], int(m["admin_level"]), int(m["version"])
        geojson_dicts = load_geojson_pickle(m.string)
        admin_names = sorted(geojson_dicts.keys()) if geojson_dicts else []
        names_str = "\n".join(admin_names)
        shape_hash = hashlib.sha256(names_str.encode()).hexdigest()[:16]
        entry = {
            "country": c,
            "admin_level": lvl,
            "version": ver,
            "admin_name_count": len(admin_names),
            "shape_hash": shape_hash,
        }
        if include_admin_names:
            entry["admin_names"] = admin_names
        results.append(entry)
    return results


def get_shape_filename(dot_name, admin_level, version):
    try:
        return get_shape_filenames(country=dot_name.country, admin_level=admin_level, version=version)[0].string
    except IndexError:
        return None


def get_shapes(dot_name, admin_level, version):
    feature_collection = {'type': 'FeatureCollection', 'features': []}
    available_versions = detect_shape_versions(country=dot_name.country)
    if str(version) not in available_versions:
        raise HTTPException(
            status_code=400,
            detail=f'Invalid version {version} for country {dot_name.country}. Available: {",".join(available_versions)}'
        )
    matches = get_shape_filenames(country=dot_name.country, admin_level=admin_level, version=version)
    if not matches:
        return feature_collection
    geojson_dicts = load_geojson_pickle(pickle_filename=matches[0].string)
    if geojson_dicts:
        feature_collection["features"] = [
            geojson for feature_dn, geojson in geojson_dicts.items()
            if DotName(dot_name_str=feature_dn).is_descendant(dn=dot_name) or
               DotName(dot_name_str=feature_dn) == dot_name
        ]
    return feature_collection


def read_dot_names(request):
    dot_name_str = request.query_params.get("dot_name")
    if dot_name_str is None:
        raise HTTPException(status_code=400, detail="Parameter dot_name is missing from the request.")
    return dot_name_str.strip().split(',')


def is_valid_dot_name(dot_name) -> bool:
    if not dot_name:
        return False
    return all(p.strip() != "" for p in dot_name.parts)


def read_channel(request):
    channel = request.query_params.get("channel")
    if channel is None:
        raise HTTPException(status_code=400, detail='Parameter channel is missing from the request.')
    return channel


def read_subgroup(request):
    subgroup = request.query_params.get("subgroup")
    if subgroup is None:
        raise HTTPException(status_code=400, detail='Parameter subgroup is missing from the request.')
    return subgroup


def read_year(request):
    year = request.query_params.get("year")
    if year is None:
        raise HTTPException(status_code=400, detail='Parameter year is missing from the request.')
    return int(year)


def read_month(request):
    month = request.query_params.get("month")
    if month is None:
        return None
    try:
        month = int(month)
    except ValueError:
        raise HTTPException(status_code=400, detail='Parameter month must be an integer.')
    if month > 12 or month < 1:
        raise HTTPException(status_code=400, detail='Parameter month must be between 1 and 12.')
    return month


def read_data(request):
    data = request.query_params.get("data")
    if data is None:
        raise HTTPException(status_code=400, detail='Parameter data is missing from the request.')
    mapping = {'data': DataFileKeys.DATA, 'data_lower_bound': DataFileKeys.DATA_LOWER_BOUND, 'data_upper_bound': DataFileKeys.DATA_UPPER_BOUND}
    if data not in mapping:
        raise HTTPException(status_code=400, detail=f'Invalid data value: {data}')
    return mapping[data]


def read_admin_level(request, required=True):
    admin_level = request.query_params.get("admin_level")
    if admin_level is None and required:
        raise HTTPException(status_code=400, detail='Parameter admin_level is missing from the request.')
    if admin_level is not None:
        admin_level = int(admin_level)
    if required and admin_level < 0:
        raise HTTPException(status_code=400, detail='Admin level must be a non-negative integer')
    return admin_level


def read_shape_version(request):
    v = request.query_params.get("shape_version")
    if v is None:
        return 1
    v = int(v)
    if v < 1:
        raise HTTPException(status_code=400, detail='shape_version must be an integer > 0')
    return v


def read_upfill(request):
    return request.query_params.get("upfill") in TRUTHY


def read_use_descendant_dot_names(request):
    return request.query_params.get("use_descendant_dot_names") in TRUTHY


def populate_cache(shapes=True, data=True):
    if shapes:
        for filename in get_shape_filenames():
            load_geojson_pickle(pickle_filename=filename.string, use_cache=False)
    if data:
        for filename in get_data_filenames():
            open_data_file(filename=filename.string, use_cache=False)


populate_cache()
