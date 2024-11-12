import pandas as pd
from fastapi import APIRouter, Request, HTTPException
from helpers.dot_name import DotName
from helpers.controller_helpers import read_dot_names, read_subgroup, read_channel, read_year, read_month, read_data, \
    read_admin_level, ControllerException, get_all_countries, get_dataframe, DataFileKeys, read_shape_version

router = APIRouter()


@router.get("/map")
async def get_map(request: Request):
    """
    Example 1: /map?dot_name=Africa:Benin&channel=unmet_need&subgroup=15-24_urban&year=2007&data=data&admin_level=2
    return:
        {
            'Africa:Benin:Borgou': 0.1,
            'Africa:Benin:Collines': 0.2,
            ...
         }

    Example 2: /map?dot_name=Africa&channel=unmet_need&subgroup=15-24_urban&year=2007&data=data&version=2&admin_level=2
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
        month = read_month(request=request)
        data_key = read_data(request=request)
        shape_version = read_shape_version(request=request)
        requested_admin_level = read_admin_level(request=request)   #TODO: Map examples above don't include admin but shown
                                                                    # as required in controller_helpers.py read_admin_level
        if requested_admin_level < dot_name.admin_level:
            raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

        # Handle the case where continent-level dot_name is provided, too
        if dot_name.country is None:
            countries = get_all_countries()
            all_countries_on_continent = True
        else:
            countries = [dot_name.country]
            all_countries_on_continent = False

        return_list = []
        for country in countries:
            #version = read_version(request=request, country=country, channel=channel, subgroup=subgroup)

            df = get_dataframe(country=country, channel=channel, subgroup=subgroup, version=shape_version)

            # limit data to the descendant dot_names at the requested admin level
            all_dot_names = [DotName(dn) for dn in df[DataFileKeys.DOT_NAME].unique() if pd.notnull(dn)]
            parent_dot_name = DotName.from_parts(parts=[dot_name.continent, country]) if all_countries_on_continent else dot_name
            child_dot_names = [str(dn) for dn in all_dot_names
                               if dn.is_descendant_or_self(parent_dot_name) and dn.admin_level == requested_admin_level]
            df = df.loc[df[DataFileKeys.DOT_NAME].isin(child_dot_names)]

            # limit to requested data year
            df = df.loc[df[DataFileKeys.YEAR] == year]

            if month is not None:
                if DataFileKeys.MONTH in df.columns:
                    df = df.loc[df[DataFileKeys.MONTH] == str(month)]
            elif month is None and 'all' in df[DataFileKeys.MONTH].values:
                df = df.loc[df[DataFileKeys.MONTH] == 'all']

                # update the return with the newly found entries
                new_values = df[[DataFileKeys.DOT_NAME, data_key, 'data_lower_bound', 'data_upper_bound']].rename(
                    columns={DataFileKeys.DOT_NAME: 'id', data_key: 'value'}, inplace=False).to_dict('records')
            return_list.extend(new_values)
        return return_list
    except ControllerException as e:
        return HTTPException(status_code=400, detail=str(e))
