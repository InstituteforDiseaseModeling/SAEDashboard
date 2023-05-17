from flask import request
from flask_restful import Resource
from rse_api.decorators import register_resource
from service.helpers.controller_helpers import read_dot_names, ControllerException, DotName, read_channel, read_subgroup, \
    read_version, get_dataframe, DataFileKeys


@register_resource(['/timeseries'])
class TraceData(Resource):
    def get(self):
        """
        Example 1:
        /timeseries?dot_name=Africa:Benin:Borgou&channel=traditional_method&subgroup=15-24_urban
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

        :return: timeseries chart data
        """
        try:
            # handle get arguments
            dot_names = read_dot_names(request=request)
            if len(dot_names) > 1:
                raise ControllerException('indicators can only be requested for one dot_name at a time.')
            dot_name = DotName(dot_name_str=dot_names[0])
            channel = read_channel(request=request)
            subgroup = read_subgroup(request=request)

            # TODO: the call to read version REALLY depends on how we version. Currently assumes file-based versioning,
            # which the rest of the code may/moy not be able to handle at the moment.
            version = read_version(request=request, country=dot_name.country, channel=channel, subgroup=subgroup)

            df = get_dataframe(country=dot_name.country, channel=channel, subgroup=subgroup, version=version)

            # limit data to the requested dot_name only
            df = df.loc[df[DataFileKeys.DOT_NAME] == str(dot_name), :]

            data = {}

            for index, row in df.iterrows():
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
                data[row[DataFileKeys.YEAR]]['reference_lower_bound'] = row[DataFileKeys.REFERENCE_LOWER_BOUND]
                data[row[DataFileKeys.YEAR]]['reference_middle'] = row[DataFileKeys.REFERENCE]
                data[row[DataFileKeys.YEAR]]['reference_upper_bound'] = row[DataFileKeys.REFERENCE_UPPER_BOUND]

            return list(data.values())

        except ControllerException as e:
            return str(e), 400
