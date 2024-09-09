import os

from glob import glob
from packaging import version
import pandas as pd
import pickle
import re

from service.helpers.dot_name import DotName

# caches for csv data files (and shape files) so we only need to read each file once (performance speedup)
DATA_CACHE = {}
SHAPE_CACHE = {}

MASTER_DATA_FILE_REGEX = re.compile(
    '^(?P<country>.+)__(?P<channel>.+)__(?P<subgroup>.+)__(?P<version>.+)\.csv$')

MASTER_SHAPE_FILE_REGEX = re.compile(
    '^(?P<country>.+)__l(?P<level>\d+)__(?P<version>\d+)\.shp.pickle$')

# Flask mishandles boolean as string
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
    SUBGROUP = 'subgroup'


current_dir = os.path.dirname(os.path.abspath(__file__))
data_root = os.path.join(current_dir, '..', 'data')
data_root = os.path.join(data_root, 'latest') if os.getenv('SAE_AKS') else data_root
data_dir = os.path.join(data_root, 'data')
PROCESSED_DATA_FILE = os.path.join(data_root, "data.pickle")
shape_dir = os.path.join(data_root, 'shapefiles')

DATA = 'data'
SHAPE = 'shape'


class ControllerException(Exception):
    pass


###
# version handling methods

def detect_versions(country, channel, subgroup):
    # Each individual data file is versioned. This returns the versions available for a selected data set.
    # detect versions of data. Does not check availability of dot_names, channels, etc.
    regex = re.compile('^%s__%s__%s__(?P<version>.+)\.csv$' % (country, channel, subgroup))

    country_datafiles = {}
    for fn in os.listdir(data_dir):
        match_obj = regex.match(fn)
        if match_obj is not None:
            country_datafiles[match_obj['version']] = match_obj.string
    return list(country_datafiles.keys())


def detect_shape_versions(country):
    regex = re.compile('^%s__l(?P<admin_level>.+)__(?P<version>.+)\.shp\.pickle$' % country)
    country_datafiles = {}
    for fn in os.listdir(shape_dir):
        match_obj = regex.match(fn)
        if match_obj is not None:
            country_datafiles[match_obj['version']] = match_obj.string
    return list(country_datafiles.keys())


def detect_latest_version(country, channel, subgroup):
    versions = sorted([version.parse(v) for v in detect_versions(country=country, channel=channel, subgroup=subgroup)])
    if len(versions) == 0:
        raise ControllerException('No versions of (%s, %s) data for country: %s' % (channel, subgroup, country))
    else:
        latest_version = versions[-1]
    return str(latest_version)


###
# data file reading methods

def get_data_filename(country, channel, subgroup, version):
    matches = get_data_filenames(country=country, channel=channel, subgroup=subgroup, version=version)
    if len(matches) > 1:
        raise Exception('There are %s filenames matching country: %s channel: %s subgroup: %s version: %s' %
                        (len(matches), country, channel, subgroup, version))
    elif len(matches) == 0:
        data_filename = None
    else:
        data_filename = matches[0].string
    return data_filename


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


def get_data_filenames(country=None, channel=None, subgroup=None, version=None):
    """
    Get the filenames of data files based on filters provided.
    :param country: Which country to filter on.
    :param channel: Which channel to filter on.
    :param subgroup:  Which subgroup to filter on.
    :param version: Which version to filter on.
    :return: A list of matches. Each match can carry a "country", "channel", "subgroup" or "version" if set to null in
    the arguments.
    """
    # returns match objects for further filtering
    regex_str = '^%s__%s__%s__%s\.csv$'
    country_pattern = '(?P<country>.+)' if country is None else country
    channel_pattern = '(?P<channel>.+)' if channel is None else channel
    subgroup_pattern = '(?P<subgroup>.+)' if subgroup is None else subgroup
    version_pattern = '(?P<version>.+)' if version is None else version
    regex = re.compile(regex_str % (country_pattern, channel_pattern, subgroup_pattern, version_pattern))
    matches = [regex.match(fn) for fn in os.listdir(data_dir)]
    matches = [m for m in matches if m is not None]
    return matches


def get_all_countries():
    # returns all countries in the dataset, regardless of version, etc.

    countries = set()
    for matches in get_data_filenames():
        countries.add(matches['country'])
    return list(countries)


def get_all_countries_for_shapes():
    # returns all countries with available shapes
    countries = set()
    for filename in glob(os.path.join(shape_dir, "*.pickle")):
        country, _, _ = extract_shape_info_from_filename(os.path.basename(filename))
        if country is not None:
            countries.add(country)
    return list(countries)


def get_child_dot_names(parent_dot_name):
    # returns all available dot_names one level below the provided one. Scans ALL data files, regardless of version etc.

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
            # Use exact dot_name
            if str(dot_name) in df[DataFileKeys.DOT_NAME].values:
                subgroups.add(m['subgroup'])
    return list(subgroups)


def get_channels(dot_name, subgroup=None, version=None, use_descendent_dot_names=False, admin_level=None):
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
            # exact dot_name matching only
            if str(dot_name) in df[DataFileKeys.DOT_NAME].values:
                channels.add(m['channel'])
    return list(channels)


def get_dataframe(country, channel, subgroup, version):
    # country = get_country_name(dot_name=dot_name)
    available_versions = detect_versions(country=country, channel=channel, subgroup=subgroup)
    if version not in available_versions:
        raise ControllerException('Invalid version %s for country %s channel %s subgroup %s. Available versions: %s' %
                                  (version, country, channel, subgroup, ','.join(available_versions)))

    filename = get_data_filename(country=country, channel=channel, subgroup=subgroup, version=version)
    df = open_data_file(filename=filename)
    return df


def open_data_file(filename, use_cache=True):
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
        'subgroup': DataFileKeys.SUBGROUP,
        # 'period.id': DataFileKeys.YEAR,
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


# def get_shape_filenames(dot_name, admin_level, version):
#     country = get_country_name(dot_name=dot_name)
#     pickle_filename = '%s__l%s__%s.shp.pickle' % (country, admin_level, version)
#     return [pickle_filename]


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
    admin_pattern = '(?P<channel>.+)' if admin_level is None else admin_level
    version_pattern = '(?P<version>.+)' if version is None else version
    regex = re.compile(regex_str % (country_pattern, admin_pattern, version_pattern))
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
    feature_collection = {'type': 'FeatureCollection', 'features': []}

    available_versions = detect_shape_versions(country=dot_name.country)
    if str(version) not in available_versions:
        raise ControllerException('Invalid version %s for country %s . Available versions: %s' %
                                  (version, dot_name.country, ','.join(available_versions)))

    pickle_filename = get_shape_filename(dot_name=dot_name, admin_level=admin_level, version=version)

    geojson_dicts = load_geojson_pickle(pickle_filename=pickle_filename)
    if geojson_dicts is not None:  # None means there is no such shape file
        # find features/shapes at the appropriate admin_level in (under) (child of) the provided dot_name and return
        # as GeoJSON by the feature dot_name in a dict
        results = []
        for feature_dn, geojson_dict in geojson_dicts.items():
            feature_dn = DotName(dot_name_str=feature_dn)
            if feature_dn.is_descendant(dn=dot_name) or feature_dn == dot_name:
                results.append(geojson_dict)
        feature_collection['features'] = results

    return feature_collection


###
# methods for reading/parsing/error handling get input arguments


def read_dot_names(request):
    dot_name_str = request.query_params.get("dot_name")
    if dot_name_str is None:
        raise ControllerException('Parameter dot_name is missing from the request.')
    dot_names = dot_name_str.strip().split(',')
    return dot_names


def read_version(country, channel, subgroup, request):
    # TODO: we need to fix versioning at some point. Only returning ver 1 by default for now.
    version = request.query_params.get("version")
    if version is None:
        return '1'
    # detect_latest_version(country=country, channel=channel, subgroup=subgroup))


def read_channel(request):
    channel = request.query_params.get("channel")
    if channel is None:
        raise ControllerException('Parameter channel is missing from the request.')
    return channel


def read_subgroup(request):
    subgroup = request.query_params.get("subgroup")
    if subgroup is None:
        raise ControllerException('Parameter subgroup is missing from the request.')
    return subgroup


def read_year(request):
    year = request.query_params.get("year")
    if year is None:
        raise ControllerException('Parameter year is missing from the request.')
    return int(year)


def read_month(request):
    month = request.query_params.get("month")
    if month is None:
        return None
    try:
        month = int(month)
    except ValueError:
        raise ControllerException('Parameter month must be an integer.')
    if month > 12 or month < 1:
        raise ControllerException('Parameter month must be between 1 and 12.')
    return month


def read_data(request):
    data = request.query_params.get("data")
    if data is None:
        raise ControllerException('Parameter data is missing from the request.')
    if data == 'data':
        data = DataFileKeys.DATA
    elif data == 'data_lower_bound':
        data = DataFileKeys.DATA_LOWER_BOUND
    elif data == 'data_upper_bound':
        data = DataFileKeys.DATA_UPPER_BOUND
    else:
        raise ControllerException('Invalid data value: %s . Must be one of data, data_lower_bound, data_upper_bound' %
                                  data)
    return data


def read_admin_level(request, required=True):
    admin_level = request.query_params.get("admin_level")
    if admin_level is None and required:
        raise ControllerException('Parameter admin_level is missing from the request.')
    if admin_level is not None:
        admin_level = int(admin_level)
    if required:
        if admin_level < 1:
            raise ControllerException('Admin level must be an integer > 0')
    return admin_level


def read_shape_version(request, required=True):
    shapefile_version = request.query_params.get("shape_version")
    if shapefile_version is None and required:
        raise ControllerException('Parameter shapefile_version is missing from the request.')
    if shapefile_version is not None:
        shapefile_version = int(shapefile_version)
    if required:
        if shapefile_version < 1:
            raise ControllerException('shapefile_version must be an integer > 0')
    return shapefile_version


def read_upfill(request):
    # whether or not to go up one admin level to fill shape requests if no shapes exist at the requested level
    upfill = request.query_params.get("upfill")
    upfill = True if upfill in TRUTHY else False
    return upfill


def read_use_descendant_dot_names(request):
    use_descendant_dot_names = request.query_params.get("use_descendant_dot_names")
    use_descendant_dot_names = True if use_descendant_dot_names in TRUTHY else False
    return use_descendant_dot_names


###
# performance improvements


def populate_cache(shapes=True, data=True):
    if shapes:
        for filename in get_shape_filenames():
            load_geojson_pickle(pickle_filename=filename.string, use_cache=False)
    if data:
        for filename in get_data_filenames():
            open_data_file(filename=filename.string, use_cache=False)


# automatically call this for now
populate_cache()
