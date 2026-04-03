"""
Controller Helpers Module

This module provides core utilities for loading, caching, and interacting with indicator data files
and administrative boundary shapefiles. It supports functionality such as:

- Detecting and listing available data and shape versions
- Retrieving metadata (channels, subgroups, admin levels, years) associated with indicators
- Parsing structured file naming conventions
- Matching hierarchical region identifiers (dot_names) across data files
- Reading and transforming data into a format suitable for FastAPI endpoints
- Caching CSV and pickle files to optimize performance across repeated calls

It is intended to be used by FastAPI controller routes to support API functionality for health
indicator dashboards or spatial analytic tools.
"""

import os
from glob import glob
from fastapi import HTTPException
from packaging import version
import pandas as pd
import pickle
import re

from service.helpers.dot_name import DotName

# Caches for data and shapefiles to avoid repeated disk reads and improve performance
DATA_CACHE = {}
SHAPE_CACHE = {}

# Regular expressions to parse standardized file naming formats
MASTER_DATA_FILE_REGEX = re.compile(
    '^(?P<country>.+)__(?P<channel>.+)__(?P<subgroup>.+)__(?P<version>.+)\.csv$')

MASTER_SHAPE_FILE_REGEX = re.compile(
    '^(?P<country>.+)__l(?P<level>\d+)__(?P<version>\d+)\.shp.pickle$')

# Common string representations of boolean truth
TRUTHY = ['true', 'True', 'yes']

# Keys used in data files for structured parsing
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

# Define data/shapefile directories based on environment
current_dir = os.path.dirname(os.path.abspath(__file__))
data_root = os.path.join(current_dir, '..', 'data')
data_root = os.path.join(data_root, 'latest') if os.getenv('SAE_AKS') else data_root
data_dir = os.path.join(data_root, 'data')
PROCESSED_DATA_FILE = os.path.join(data_root, "data.pickle")
shape_dir = os.path.join(data_root, 'shapefiles')

DATA = 'data'
SHAPE = 'shape'

# Custom exception for validation and usage errors
class ControllerException(Exception):
    pass


# ------------------------
# Version detection helpers
# ------------------------

def detect_shape_versions(country):
    """
    Return available shapefile versions for a given country.
    """
    regex = re.compile('^%s__l(?P<admin_level>.+)__(?P<version>.+)\.shp\.pickle$' % country, re.IGNORECASE)
    country_datafiles = {}
    for fn in os.listdir(shape_dir):
        match_obj = regex.match(fn)
        if match_obj is not None:
            country_datafiles[match_obj['version']] = match_obj.string
    return list(country_datafiles.keys())

# ------------------------
# Data File Reading Methods
# ------------------------

def extract_info_from_filename(filename: str) -> (str, str, str, str):
    """
    Extract the information from a data file name.
    :param filename: File name to extract info from
    :return: (country, channel, subgroup, version)
    """
    match = MASTER_DATA_FILE_REGEX.match(filename)
    return match["country"], match["channel"], match["subgroup"], match["version"]


def extract_shape_info_from_filename(filename: str) -> (str, str, str):
    """
    Extract the information from a shape file name.
    :param filename: File name to extract info from
    :return: (country, level, version)
    """
    match = MASTER_SHAPE_FILE_REGEX.match(filename)
    if match:
        return match["country"], match["level"], match["version"]
    else:
        return None, None, None


def get_data_filenames(country=None, channel=None, subgroup=None, version=None, data_dir=data_dir):
    """
    Get the filenames of data files based on filters provided.
    :param country: Which country to filter on.
    :param channel: Which channel to filter on.
    :param subgroup:  Which subgroup to filter on.
    :param version: Which version to filter on.
    :param data_dir: Directory to search (defaults to the standard indicator data directory).
    :return: A list of matches. Each match can carry a "country", "channel", "subgroup" or "version" if set to null in
    the arguments.
    """
    # returns match objects for further filtering
    regex_str = '^%s__%s__%s__%s\.csv$'
    country_pattern = '(?P<country>.+)' if country is None else country
    channel_pattern = '(?P<channel>.+)' if channel is None else channel
    subgroup_pattern = '(?P<subgroup>.+)' if subgroup is None else subgroup
    version_pattern = '(?P<version>.+)' if version is None else version
    regex = re.compile(regex_str % (country_pattern, channel_pattern, subgroup_pattern, version_pattern), re.IGNORECASE)
    matches = [regex.match(fn) for fn in os.listdir(data_dir)]
    matches = [m for m in matches if m is not None]
    return matches


LAYER_DATA_DIR = os.path.join(data_root, 'layers')


def open_layer_csv(country: str, layer_id: str) -> dict:
    """
    Load all CSVs for a given layer_id from the layers directory, grouped by year.

    Returns:
      - { year: { site: {...} } }  for multi-year layers
      - { site: {...} }            for single-year layers (subgroup == "all")
    """
    matches = get_data_filenames(country=country, channel=layer_id, data_dir=LAYER_DATA_DIR)
    if not matches:
        raise ControllerException(f"No CSV found for layer '{layer_id}' (country: {country})")

    result = {}
    for m in matches:
        year = m["subgroup"]
        df = pd.read_csv(os.path.join(LAYER_DATA_DIR, m.string))
        df = df.where(pd.notna(df), None)
        key_col = df.columns[0]
        records = df.set_index(key_col).to_dict(orient="index")
        if year == "all":
            return records
        result[year] = records

    return result


def get_all_countries():
    """
    Return a list of all countries found in data filenames.
    """
    countries = set()
    for matches in get_data_filenames():
        countries.add(matches['country'])
    return list(countries)


def get_all_countries_for_shapes():
    """
    Return a list of all countries for which shapefiles exist.
    """
    countries = set()
    for filename in glob(os.path.join(shape_dir, "*.pickle")):
        country, _, _ = extract_shape_info_from_filename(os.path.basename(filename))
        if country is not None:
            countries.add(country)
    return list(countries)


def get_child_dot_names(parent_dot_name):
    """
    Return dot_names that are one generation below the given parent_dot_name.
    """
    all_countries = True if parent_dot_name.admin_level == 0 else False
    if all_countries:
        # TODO: BUG: This ignores whether the parent (region only) dot_name is valid! Does not check containment.
        dot_names = [DotName.from_parts([parent_dot_name.continent, country]) for country in get_all_countries()]
    else:
        dot_names = {}
        for filename_match in get_data_filenames(country=parent_dot_name.country):
            df = open_data_file(filename=os.path.join(data_dir, filename_match.string))
            for dot_name in df[DataFileKeys.DOT_NAME]:
                dot_names[dot_name] = DotName(dot_name_str=dot_name)

        # make sure we only return the dot_names one level below the provided root
        dot_names = [dn for dn in dot_names.values() if parent_dot_name.generational_distance(dn) == -1]
    return dot_names


def get_subgroups(dot_name, channel=None, version=None, use_descendent_dot_names=False, admin_level=None):
    """
    Return a list of subgroups available for the given dot_name and filters.
    If `use_descendent_dot_names` is True, searches all descendants of dot_name.
    """
    use_descendent_dot_names = True if admin_level is not None else use_descendent_dot_names
    filename_matches = get_data_filenames(country=dot_name.country, channel=channel, version=version)

    # If no country provided assume we want the subgroups for everything
    # use_descendent_dot_names = dot_name.country is None

    # read each file and check to verify that the specified dot_name is contained before recording its subgroup
    subgroups = set()
    for m in filename_matches:
        df = open_data_file(filename=m.string)
        if use_descendent_dot_names:
            # add subgroup if there is a descendent of the provided dot_name in this file
            data_dot_names = [DotName(dot_name_str=dn) for dn in df[DataFileKeys.DOT_NAME].unique()]
            if admin_level is None:
                # add subgroup if there is a descendent of the provided dot_name in this file
                lambda_compare = lambda dn: dn.is_descendant_or_self(dn=dot_name)
            else:
                # select subgroups from dot_names at the exact request admin_level depth
                lambda_compare = lambda dn: dn.is_descendant_or_self(dn=dot_name) and dn.admin_level == admin_level
            if any([lambda_compare(ddn) for ddn in data_dot_names]):
                subgroups.add(m['subgroup'])
        else:
            # Use exact dot_name (case-insensitive)
            if str(dot_name).lower() in df[DataFileKeys.DOT_NAME].str.lower().values:
                subgroups.add(m['subgroup'])
    return list(subgroups)


def get_channels(dot_name, subgroup=None, version=None, use_descendent_dot_names=False, admin_level=None):
    """
    Return a list of indicators/channels available for the given dot_name and filters.
    """
    use_descendent_dot_names = True if admin_level is not None else use_descendent_dot_names
    filename_matches = get_data_filenames(country=dot_name.country, subgroup=subgroup, version=version)

    # read each file and check to verify that the specified dot_name is contained before recording its channel
    channels = set()
    for m in filename_matches:
        df = open_data_file(filename=m.string)
        if use_descendent_dot_names:
            data_dot_names = [DotName(dot_name_str=dn) for dn in df[DataFileKeys.DOT_NAME].unique()]
            if admin_level is None:
                # add channel if there is a descendent of the provided dot_name in this file
                lambda_compare = lambda dn: dn.is_descendant_or_self(dn=dot_name)
            else:
                # select channels from dot_names at the exact request admin_level depth
                lambda_compare = lambda dn: dn.is_descendant_or_self(dn=dot_name) and dn.admin_level == admin_level
            if any([lambda_compare(ddn) for ddn in data_dot_names]):
                channels.add(m['channel'])
        else:
            # exact dot_name matching only (case-insensitive)
            if str(dot_name).lower() in df[DataFileKeys.DOT_NAME].str.lower().values:
                channels.add(m['channel'])
    return list(channels)


def get_dataframe(country, channel, subgroup, version):
    """
    Load and return a pandas DataFrame for the specified data file, ensuring the version is valid and filename is unique.
    """
    # Compile pattern and filter filenames directly
    regex_str = f'^{country}__{channel}__{subgroup}__{version}\\.csv$'
    regex = re.compile(regex_str, re.IGNORECASE)
    matches = [regex.match(fn) for fn in os.listdir(data_dir) if regex.match(fn)]

    if len(matches) == 0:
        raise HTTPException(status_code=400, detail=f"No matching file for {country} / {channel} / {subgroup} / v{version}")
    if len(matches) > 1:
        raise HTTPException(status_code=400, detail=
            f"Multiple files match {country} / {channel} / {subgroup} / v{version}: "
            f"{[m.string for m in matches]}"
        )

    filename = matches[0].string
    df = open_data_file(filename)
    return df


def get_indicator_version(country, channel):
    """
    Return the unique version numbers for a given (country, channel),
    regardless of subgroups.

    Raises error if more than one version is found (to enforce uniqueness).
    """
    regex = re.compile(rf'^{country}__{channel}__.+__(?P<version>\d+)\.csv$', re.IGNORECASE)

    versions = set()
    for fn in os.listdir(data_dir):
        match = regex.match(fn)
        if match:
            versions.add(int(match.group("version")))

    if len(versions) == 0:
        raise HTTPException(status_code=400, detail=f"No versions found for {country} / {channel}")

    # TODO: Handle multiple versions of shapefile for an indicator in the case of separate subgroups
    if len(versions) > 1:
        raise HTTPException(status_code=400, detail=f"More than one shapefile version for {channel} indicator: {sorted(versions)}")

    return str(next(iter(versions)))


def get_indicator_admin_levels(country, channel, version):
    """
    Get the admin levels of available data based on filters provided.
    :param country: Which country to filter on.
    :param channel: Which channel to filter on.
    :param version: Which shapefile version to filter on.
    :return: A set of admin levels corresponding to country and indicator provided
    """
    admin_levels = set()

    # Find files that match country, channel, version
    matches = get_data_filenames(country=country, channel=channel, version=version)

    # For each file, look at dot_name column to determine admin_levels of data available
    for file in matches:
        df = open_data_file(filename=file.string)

        admin_levels.update((df['dot_name'].str.split(':').apply(len) - 1).unique())

    return admin_levels


def get_indicator_subgroups(country, channel, version):
    """
    Get the indicator subgroup(s) of data files based on filters provided.
    :param country: Which country to filter on.
    :param channel: Which channel to filter on.
    :param version: Which channel to filter on.
    :return: An array of subgroups corresponding to country and indicator provided
    """
    # returns match objects for further filtering
    regex_str = '^%s__%s__(?P<subgroup>.+)__%s\.csv$'
    country_pattern = '(?P<country>.+)' if country is None else country
    channel_pattern = '(?P<channel>.+)' if channel is None else channel
    version_pattern = '(?P<version>.+)' if version is None else version

    # Compile regex and list all files in dir matching regex
    regex = re.compile(regex_str % (country_pattern, channel_pattern, version_pattern), re.IGNORECASE)
    matches = [regex.match(fn) for fn in os.listdir(data_dir)]

    # Extract subgroup from matched files and convert them to int
    subgroups = [m.group('subgroup') for m in matches if m]

    return subgroups


def get_indicator_time(country, channel, subgroup, version):
    """
    Generate a dictionary of years → [months] for a given indicator dataset.
    Supports monthly data if available.
    """
    time_dict = {}
    df = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=version)
    # Load unique years from df
    years = df[DataFileKeys.YEAR].unique()
    # Check if 'month' column exists
    if DataFileKeys.MONTH in df.columns:
        # Group by 'year' and aggregate 'month'
        year_month_dict = df.groupby(DataFileKeys.YEAR)[DataFileKeys.MONTH].unique().to_dict()
        # Convert numpy arrays to lists
        for year,months in year_month_dict.items():
            if pd.isna(months[0]):
                time_dict[year] = []
            else:
                months = list(months)
                if 'all' in months:
                    months = [x for x in months if x != 'all']
                time_dict[year] = months
    else:
        time_dict = {year: [] for year in years}
    return time_dict


def open_data_file(filename, use_cache=True):
    """
    Read and process a data CSV file, apply reference CI transformation, and optionally use cache.
    """
    full_path = os.path.join(data_dir, filename)

    # first, check the cache for previously loaded data
    if use_cache:
        cached_df = DATA_CACHE.get(full_path, None)
        if cached_df is not None:
            return cached_df

    channel = MASTER_DATA_FILE_REGEX.match(filename)['channel']

    df = pd.read_csv(full_path)

    # rename columns and massage data to usable format
    df = df.rename(columns={
        'state': DataFileKeys.DOT_NAME,
        channel: DataFileKeys.REFERENCE,
        'se.' + channel: 'reference_stderr',
        'pred': DataFileKeys.DATA,
        'pred_upper': DataFileKeys.DATA_UPPER_BOUND,
        'pred_lower': DataFileKeys.DATA_LOWER_BOUND
    })

    # now convert the reference stderr to upper/lower bounds
    ciMultipier = 1.96  # multiplier to convert stdErr to 95% CI

    new_columns = {
        DataFileKeys.REFERENCE_LOWER_BOUND: (
        (df.loc[:, DataFileKeys.REFERENCE] - df.loc[:, 'reference_stderr'].apply(lambda x: x * ciMultipier))),
        DataFileKeys.REFERENCE_UPPER_BOUND: (
        (df.loc[:, DataFileKeys.REFERENCE] + df.loc[:, 'reference_stderr'].apply(lambda x: x * ciMultipier)))
    }
    df = df.assign(**new_columns)
    df = df.drop(columns='reference_stderr')

    # populate the cache with the newly loaded data
    DATA_CACHE[full_path] = df
    return df


def load_geojson_pickle(pickle_filename, use_cache=True):
    """
    Load a pickled GeoJSON shapefile and optionally use the in-memory cache.
    """
    if pickle_filename is None:
        return None

    full_path = os.path.join(shape_dir, pickle_filename)

    # first, check the cache for previously loaded data
    if use_cache:
        cached_geojson_dicts = SHAPE_CACHE.get(full_path, None)
        if cached_geojson_dicts is not None:
            return cached_geojson_dicts

    try:
        with open(full_path, 'rb') as f:
            geojson_dicts = pickle.load(f)
    except FileNotFoundError as e:
        return None

    # populate the cache with the newly loaded data
    SHAPE_CACHE[pickle_filename] = geojson_dicts

    return geojson_dicts


def get_shape_filenames(country=None, admin_level=None, version=None):
    """
    Get the filenames of data files based on filters provided.
    :param country: Which country to filter on.
    :param admin_level: Which admin_level to filter on.
    :param version: Which version to filter on.
    :return: A list of matches. Each match can carry a "country", "admin_level" or "version" if set to null in
    the arguments.
    """
    # returns match objects for further filtering
    regex_str = '^%s__l%s__%s\.shp.pickle$'
    country_pattern = '(?P<country>.+)' if country is None else country
    admin_pattern = '(?P<admin_level>.+)' if admin_level is None else admin_level
    version_pattern = '(?P<version>.+)' if version is None else version
    regex = re.compile(regex_str % (country_pattern, admin_pattern, version_pattern), re.IGNORECASE)
    matches = [regex.match(fn) for fn in os.listdir(shape_dir)]
    matches = [m for m in matches if m is not None]
    return matches


def get_shape_filename(dot_name, admin_level, version):
    try:
        filename = get_shape_filenames(country=dot_name.country, admin_level=admin_level, version=version)[0].string
    except IndexError as e:
        filename = None
    return filename


def get_shapes(dot_name, admin_level, version):
    """
    Return a GeoJSON FeatureCollection of shapes for a given region and admin level.
    Includes all child features matching the dot_name.
    """
    feature_collection = {'type': 'FeatureCollection', 'features': []}

    available_versions = detect_shape_versions(country=dot_name.country)
    if str(version) not in available_versions:
        raise HTTPException(status_code=400, detail='Invalid version %s for country %s . Available versions: %s' %
                                  (version, dot_name.country, ','.join(available_versions)))

    # Get matching shape filenames
    matches = get_shape_filenames(
        country=dot_name.country, admin_level=admin_level, version=version
    )

    if not matches:
        return feature_collection

    # Use the first match
    pickle_filename = matches[0].string
    geojson_dicts = load_geojson_pickle(pickle_filename=pickle_filename)

    if geojson_dicts:  # None means there is no such shape file
        # find features/shapes at the appropriate admin_level in (under) (child of) the provided dot_name and return
        # as GeoJSON by the feature dot_name in a dict
        feature_collection["features"] = [
            geojson for feature_dn, geojson in geojson_dicts.items()
            if DotName(dot_name_str=feature_dn).is_descendant(dn=dot_name) or
               DotName(dot_name_str=feature_dn) == dot_name
        ]

    return feature_collection


# ------------------------
# methods for reading/parsing/error handling get input arguments
# ------------------------

def read_dot_names(request):
    """
    Parse and return a list of dot_names from the request query parameters.
    """
    dot_name_str = request.query_params.get("dot_name")
    if dot_name_str is None:
        raise HTTPException(status_code=400, detail="Parameter dot_name is missing from the request.")
    dot_names = dot_name_str.strip().split(',')
    return dot_names

def is_valid_dot_name(dot_name: str) -> bool:
    # Must be non-empty and contain no empty segments
    if not dot_name:
        return False
    if any(p.strip() == "" for p in dot_name.parts):
        return False
    return True

def read_channel(request):
    """
    Extract the 'channel' parameter from the request or raise an error if missing.
    """
    channel = request.query_params.get("channel")
    if channel is None:
        raise HTTPException(status_code=400, detail='Parameter channel is missing from the request.')
    return channel


def read_subgroup(request):
    """
    Extract the 'subgroup' parameter from the request or raise an error if missing.
    """
    subgroup = request.query_params.get("subgroup")
    if subgroup is None:
        raise HTTPException(status_code=400, detail='Parameter subgroup is missing from the request.')
    return subgroup


def read_year(request):
    """
    Extract and return the 'year' parameter as an integer.
    """
    year = request.query_params.get("year")
    if year is None:
        raise HTTPException(status_code=400, detail='Parameter year is missing from the request.')
    return int(year)


def read_month(request):
    """
    Extract and return the 'month' parameter as an integer (1–12), or None if missing.
    """
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
    """
    Parse the 'data' parameter and map it to one of the expected internal constants.
    """
    data = request.query_params.get("data")
    if data is None:
        raise HTTPException(status_code=400, detail='Parameter data is missing from the request.')
    if data == 'data':
        data = DataFileKeys.DATA
    elif data == 'data_lower_bound':
        data = DataFileKeys.DATA_LOWER_BOUND
    elif data == 'data_upper_bound':
        data = DataFileKeys.DATA_UPPER_BOUND
    else:
        raise HTTPException(status_code=400, detail='Invalid data value: %s . Must be one of data, data_lower_bound, data_upper_bound' %
                                  data)
    return data


def read_admin_level(request, required=True):
    """
    Read the requested admin_level from the query params. Raises if required and missing or invalid.
    """
    admin_level = request.query_params.get("admin_level")
    if admin_level is None and required:
        raise HTTPException(status_code=400, detail='Parameter admin_level is missing from the request.')
    if admin_level is not None:
        admin_level = int(admin_level)
    if required:
        if admin_level < 1:
            raise HTTPException(status_code=400, detail='Admin level must be an integer > 0')
    return admin_level


def read_shape_version(request):
    """
    Parse the 'shape_version' parameter and return as integer. Defaults to 1.
    """
    shapefile_version = request.query_params.get("shape_version")
    if shapefile_version is None:
        shapefile_version = 1
    else:
        shapefile_version = int(shapefile_version)
        if shapefile_version < 1:
            raise HTTPException(status_code=400, detail='shapefile_version must be an integer > 0')
    return shapefile_version


def read_upfill(request):
    """
    Parse the 'upfill' boolean query parameter; True if set to go up one admin level to fill shape requests if no shapes exist at requested level
    """
    upfill = request.query_params.get("upfill")
    upfill = True if upfill in TRUTHY else False
    return upfill


def read_use_descendant_dot_names(request):
    """
    Parse the 'use_descendant_dot_names' boolean query parameter.
    """
    use_descendant_dot_names = request.query_params.get("use_descendant_dot_names")
    use_descendant_dot_names = True if use_descendant_dot_names in TRUTHY else False
    return use_descendant_dot_names


# ------------------------
# Performance Improvements
# ------------------------

def populate_cache(shapes=True, data=True):
    """
    Eagerly load and cache all data and shape files into memory at startup for performance.
    """
    if shapes:
        for filename in get_shape_filenames():
            load_geojson_pickle(pickle_filename=filename.string, use_cache=False)
    if data:
        for filename in get_data_filenames():
            open_data_file(filename=filename.string, use_cache=False)


# automatically call this for now
populate_cache()
