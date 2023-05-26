from flask import request
from flask_restful import Resource

from rse_api.decorators import register_resource
from service.helpers.controller_helpers import read_dot_names, ControllerException, DotName, read_channel, read_subgroup, \
    read_year, read_data, read_admin_level, get_all_countries, read_version, get_dataframe, DataFileKeys


@register_resource(['/map'])
class MapData(Resource):
    def get(self):
        """
        Example 1: /map?dot_name=Africa:Benin&channel=unmet_need&subgroup=15-24_urban&year=2007&data=data
        return:
            {
                'Africa:Benin:Borgou': 0.1,
                'Africa:Benin:Collines': 0.2,
                ...
             }

        Example 2: /map?dot_name=Africa&channel=unmet_need&subgroup=15-24_urban&year=2007&data=data
        return:
            [
                {
                    "id": "Africa:Ghana:Ashanti",
                    "value": 0.13814665045808905
                },
                {
                    "id": "Africa:Ghana:Brong Ahafo",
                    "value": 0.1714535315401326
                },
                ...
            ]

        :return: Map related data
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
            data_key = read_data(request=request)
            requested_admin_level = read_admin_level(request=request)
            if requested_admin_level < dot_name.admin_level:
                raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

            # TODO: the call to read version REALLY depends on how we version. Currently assumes file-based versioning,
            # which the rest of the code may/moy not be able to handle at the moment.
            # Handle the case where continent-level dot_name is provided, too
            if dot_name.country is None:
                countries = get_all_countries()
                all_countries_on_continent = True
            else:
                countries = [dot_name.country]
                all_countries_on_continent = False

            return_list = []
            for country in countries:
                version = read_version(request=request, country=country, channel=channel, subgroup=subgroup)

                df = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=version)

                # limit data to the descendant dot_names at the requested admin level
                all_dot_names = [DotName(dn) for dn in df[DataFileKeys.DOT_NAME].unique()]
                parent_dot_name = DotName.from_parts(parts=[dot_name.continent, country]) if all_countries_on_continent else dot_name
                child_dot_names = [str(dn) for dn in all_dot_names
                                   if dn.is_descendant_or_self(parent_dot_name) and dn.admin_level == requested_admin_level]
                df = df.loc[df[DataFileKeys.DOT_NAME].isin(child_dot_names)]

                # limit to requested data year
                df = df.loc[df[DataFileKeys.YEAR] == year]

                # update the return with the newly found entries
                new_values = df[[DataFileKeys.DOT_NAME, data_key]].rename(
                    columns={DataFileKeys.DOT_NAME: 'id', data_key: 'value'}, inplace=False).to_dict('records')
                return_list.extend(new_values)
            return return_list
        except ControllerException as e:
            return str(e), 400
