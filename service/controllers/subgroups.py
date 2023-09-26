from service.helpers.controller_helpers import get_subgroups, read_dot_names, ControllerException, \
    read_admin_level, read_use_descendant_dot_names
from service.helpers.dot_name import DotName
from service.schemas.SubgroupsSchema import SubgroupsListSchema
from fastapi import APIRouter, Request

router = APIRouter()

LABELS = {
    "all": "All Women",
    "25plus_rural": "Women 25+, Rural",
    "25plus_urban": "Women 25+, Urban",
    "15-24_urban": "Women 15-24, Urban",
    "15-24_rural": "Women 15-24, Rural",
    "15-24": "Women 15-24",
    "25plus": "Women 25+",
    "15-24_Parity-0": "Women 15-24, Parity 0",
    "15-24_Parity-1plus": "Women 15-24, Parity 1+",
    "25plus_Parity-0": "Women 25+, Parity 0",
    "25plus_Parity-1": "Women 25+, Parity 1",
    "25plus_Parity-1plus": "Women 25+, Parity 1+",
    "Parity-0": "Parity 0",
    "Parity-1plus": "Parity 1+",
    'all-1': 'All-1',
    'all-NA': 'All-NA',
    'rural': 'Rural',
    'urban': 'Urban'
}


def generate_label(subgroup):
    # if we have a specific display name known, use it
    label = LABELS.get(subgroup, None)
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
