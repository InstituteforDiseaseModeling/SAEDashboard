from service.helpers.controller_helpers import get_subgroups, read_dot_names, ControllerException, \
    read_admin_level, read_use_descendant_dot_names
from service.helpers.dot_name import DotName
from service.schemas.SubgroupsSchema import SubgroupsListSchema
from fastapi import APIRouter, Request
import os

import yaml
router = APIRouter()

def generate_label(subgroup):
    # if we have a specific display name known, use it

    # Load the YAML file
    full_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../config.yaml')
    with open(full_path, "r") as file:
        config = yaml.safe_load(file)

    # Retrieve the list of indicator_labels
    subgroup_labels = config.get("subgroup_labels", {})

    label = subgroup_labels.get(subgroup, None)
    if label is None:
        # generate a display name according to a standard set of rules
        label = " ".join(p.capitalize() for p in subgroup.split('_'))
    return label


@router.get("/subgroups", response_model=SubgroupsListSchema)
async def get_subgroups_by_dotname(request: Request):
    """
    Example:    / subgroups?dot_name = Africa:Benin: Borgou
    return:
    {
        'subgroups': [
            {"id": '15-24_urban', "text": "Women 15-24, Urban"},
            {"id": '25plus_urban', "text": "Women 25+, Urban"},
            ...
        ]
    }
    """
    try:
        # handle get arguments
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise ControllerException('subgroups can only be requested for one dot_name at a time.')
        dot_name = DotName(dot_name_str=dot_names[0])
        use_descendant_dot_names = read_use_descendant_dot_names(request=request)
        requested_admin_level = read_admin_level(request=request, required=False)
        if requested_admin_level is not None:
            if requested_admin_level < dot_name.admin_level:
                raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

        subgroups = get_subgroups(dot_name=dot_name, use_descendent_dot_names=use_descendant_dot_names, admin_level=requested_admin_level)
        subgroups_response = []
        for sub in subgroups:
            label = generate_label(sub)
            subgroups_response.append({"id": sub, "text": label})

        return {"subgroups": subgroups_response}

    except ControllerException as e:
        return str(e), 400
