from service.helpers.controller_helpers import *
from service.schemas.YearsSchema import YearsSchema
from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/years", response_model=YearsSchema)
async def get_years(request: Request):
    """
    Example 1:
    /years?dot_name=Africa:Benin:Borgou&channel=unmet_need&subgroup=all
    return: {"dot_name": "Africa:Benin:Borgou", "fromYear":1990, "to_year":1994}

    Example 2:
    /years?dot_name=Africa:Benin:NOTAPROVINCE&channel=unmet_need&subgroup=all
    return: {"dot_name":"Africa:Benin:NOTAPROVINCE"}
    :return: year related data
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

        years = sorted(list(set(df[DataFileKeys.YEAR])))
        result = {
            'id': str(dot_name),
            'start_year': years[0],
            'end_year': years[-1]
        }
        return result

    except ControllerException as e:
        return str(e), 400
