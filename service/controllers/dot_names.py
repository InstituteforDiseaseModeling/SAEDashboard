from service.helpers.controller_helpers import get_child_dot_names, read_dot_names, ControllerException, is_valid_dot_name
from service.helpers.dot_name import DotName
from service.schemas.DotnamesSchema import DotnamesListSchema
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()


def transform_dotname(dot_name):
    text = dot_name.split(':')[-1].capitalize()
    return {"id": dot_name, "text": text}


@router.get("/dot_names", response_model=DotnamesListSchema)
async def get_dot_names(request: Request):
    try:
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise HTTPException(status_code=400, detail="child dot_names can only be requested for one parent dot_name at a time.")
        dot_name = DotName(dot_name_str=dot_names[0])
        if not is_valid_dot_name(dot_name):
            raise HTTPException(status_code=400, detail=f"Invalid dot_name format: {dot_name}")
        child_names = sorted([str(dn) for dn in get_child_dot_names(parent_dot_name=dot_name)])
        return {"dot_names": [transform_dotname(name) for name in child_names]}
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
