from pathlib import Path
import yaml
from service.helpers.controller_helpers import get_subgroups, read_dot_names, ControllerException, read_admin_level, read_use_descendant_dot_names
from service.helpers.dot_name import DotName
from service.schemas.SubgroupsSchema import SubgroupsListSchema
from fastapi import APIRouter, Request, HTTPException

router = APIRouter()

_config_path = Path(__file__).parent.parent / 'config.yaml'


def generate_label(subgroup):
    with open(_config_path, "r") as f:
        config = yaml.safe_load(f)
    labels = config.get("subgroup_labels", {})
    return labels.get(subgroup, " ".join(p.capitalize() for p in subgroup.split('_')))


@router.get("/subgroups", response_model=SubgroupsListSchema)
async def get_subgroups_by_dotname(request: Request):
    try:
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise ControllerException('subgroups can only be requested for one dot_name at a time.')
        dot_name = DotName(dot_name_str=dot_names[0])
        use_descendant_dot_names = read_use_descendant_dot_names(request=request)
        requested_admin_level = read_admin_level(request=request, required=False)
        if requested_admin_level is not None and requested_admin_level < dot_name.admin_level:
            raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

        subgroups = get_subgroups(dot_name=dot_name, use_descendent_dot_names=use_descendant_dot_names, admin_level=requested_admin_level)
        return {"subgroups": [{"id": sub, "text": generate_label(sub)} for sub in subgroups]}
    except ControllerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
