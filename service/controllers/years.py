from service.helpers.controller_helpers import *
from service.schemas.YearsSchema import YearsSchema
from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/years", response_model=YearsSchema)
async def get_years(request: Request):
    """
    Retrieves the start and end years of available data for a given indicator and region.

    This endpoint returns the time range (inclusive) for which indicator data exists
    for a specific `dot_name`, `channel`, and `subgroup`. It helps define the temporal
    bounds of the dataset before requesting time series or spatial data.

    Query Parameters:
        - dot_name (str): A hierarchical region identifier (e.g., "Africa:Senegal:Kolda").
                          Only one `dot_name` is allowed per request.
        - channel (str): The indicator name (e.g., "CDM", "MILDA").
        - subgroup (str): A subgroup for which the indicator applies (e.g., "all").
        - shape_version (int, optional): Version of the shapefile data to use.

    Returns:
        dict: A dictionary with the requested `dot_name` and the first and last years
              of available indicator data.

    Example 1:
    /years?dot_name=Africa:Senegal:Kolda&channel=CDM&subgroup=all&shape_version=1
    return:
        {
          "id": "Africa:Senegal:Kolda",
          "start_year": 2019,
          "end_year": 2022
        }

    Example 2:
    /years?dot_name=Africa:Senegal:Kolda:Kolda&channel=MILDA&subgroup=all
    return:
        {
            "id": "Africa:Senegal:Kolda:Kolda",
            "start_year": 2019,
            "end_year": 2024
        }
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

        df = get_dataframe(country=dot_name.country, channel=channel, subgroup=subgroup, version=shape_version)

        # limit data to the requested dot_name only
        df = df.loc[df[DataFileKeys.DOT_NAME].str.lower() == str(dot_name).lower(), :]

        years = sorted(list(set(df[DataFileKeys.YEAR])))
        result = {
            'id': str(dot_name),
            'start_year': years[0],
            'end_year': years[-1]
        }
        return result

    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise  # re-raise deliberate FastAPI exceptions
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
