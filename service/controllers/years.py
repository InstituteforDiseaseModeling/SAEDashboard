from service.helpers.controller_helpers import read_dot_names, ControllerException, read_channel, read_subgroup, get_dataframe, DataFileKeys, read_shape_version
from service.helpers.dot_name import DotName, normalize_dot_name
from service.schemas.YearsSchema import YearsSchema
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()


@router.get("/years", response_model=YearsSchema)
async def get_years(request: Request):
    try:
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise ControllerException('indicators can only be requested for one dot_name at a time.')
        dot_name = DotName(dot_name_str=dot_names[0])
        channel = read_channel(request=request)
        subgroup = read_subgroup(request=request)
        shape_version = read_shape_version(request=request)

        df = get_dataframe(country=dot_name.country, channel=channel, subgroup=subgroup, version=shape_version)
        df = df.loc[df[DataFileKeys.DOT_NAME].map(normalize_dot_name) == normalize_dot_name(str(dot_name)), :]
        years = sorted(set(df[DataFileKeys.YEAR]))
        return {'id': str(dot_name), 'start_year': years[0], 'end_year': years[-1]}
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
