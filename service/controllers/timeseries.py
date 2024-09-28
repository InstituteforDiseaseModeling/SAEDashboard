from helpers.dot_name import DotName
from service.helpers.controller_helpers import DataFileKeys, read_dot_names, ControllerException, read_channel, \
    read_subgroup, get_dataframe, read_shape_version
from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/timeseries")
async def get_timeseries(request: Request):
    """
    Example 1:
    /timeseries?dot_name=Africa:Benin:Borgou&channel=traditional_method&subgroup=15-24_urban&shape_version=2
    return:
        [
            {
                "year": 1990,
                "lower_bound": 0.018048064947315333,
                "middle": 0.08826664048800155,
                "upper_bound": 0.3399731764366215
            },
            ...
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

        # TODO: the call to read version REALLY depends on how we version. Currently assumes file-based versioning,
        # which the rest of the code may/moy not be able to handle at the moment.
        #version = read_version(request=request, country=dot_name.country, channel=channel, subgroup=subgroup)

        df = get_dataframe(country=dot_name.country, channel=channel, subgroup=subgroup, version=shape_version)

        # limit data to the requested dot_name only
        df = df.loc[df[DataFileKeys.DOT_NAME] == str(dot_name), :]

        data = {}

        for index, row in df.iterrows():
            if channel in ['CDM', 'MILDA', 'CDM_Coverage', 'MILDA_Coverage', 'weather_zones']:
                entry = "{} {}".format(row['month'], row[DataFileKeys.YEAR])
                data[entry] = {
                    'year': row[DataFileKeys.YEAR],
                    'month': row['month'],
                    'lower_bound': row[DataFileKeys.DATA_LOWER_BOUND],
                    'middle': row[DataFileKeys.DATA],
                    'upper_bound': row[DataFileKeys.DATA_UPPER_BOUND]
                }
            else:
                data[row[DataFileKeys.YEAR]] = {
                    'year': row[DataFileKeys.YEAR],
                    'lower_bound': row[DataFileKeys.DATA_LOWER_BOUND],
                    'middle': row[DataFileKeys.DATA],
                    'upper_bound': row[DataFileKeys.DATA_UPPER_BOUND]
                }

        # now further limit the data to rows where reference data exists
        # Add directly to the prediction
        df = df.loc[df[DataFileKeys.REFERENCE].notna(), :]
        for index, row in df.iterrows():
            if channel in ['CDM', 'MILDA', 'CDM_Coverage', 'MILDA_Coverage']:
                entry = "{} {}".format(row['month'], row[DataFileKeys.YEAR])
            else:
                entry = row[DataFileKeys.YEAR]
            data[entry]['reference_lower_bound'] = row[DataFileKeys.REFERENCE_LOWER_BOUND]
            data[entry]['reference_middle'] = row[DataFileKeys.REFERENCE]
            data[entry]['reference_upper_bound'] = row[DataFileKeys.REFERENCE_UPPER_BOUND]

        return list(data.values())

    except ControllerException as e:
        return str(e), 400
