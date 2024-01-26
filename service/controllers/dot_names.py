from service.helpers.controller_helpers import get_child_dot_names, read_dot_names, ControllerException
from service.helpers.dot_name import DotName
from service.schemas.DotnamesSchema import DotnamesListSchema
from fastapi import APIRouter, Request

router = APIRouter()


def transform_dotname(dot_name):
    text = dot_name.split(':')[-1].capitalize()
    return {"id": dot_name, "text": text}


@router.get("/dot_names", response_model=DotnamesListSchema)
async def get_dot_names(request: Request):
    """
    Example 1: /dot_names?dot_name=Africa
    return:
        {
            "dot_names": [
                { "id": "Africa:Benin", "text": "Benin" },
                { "id": "Africa:Burkina_Faso", "text": "Burkina_faso" },
            ...
        }

    Example 2:
    /dot_names?dot_name=Africa:Benin
    return:
        {
            "dot_names": [
                { "id": "Africa:Benin:Alibori", "text": "Alibori" },
                { "id": "Africa:Benin:Atakora", "text": "Atakora" },
                ...
            ]
        }

    Example 3:
    /dot_names?dot_name=Africa:Benin:Borgou    (no lower-level data)
    return: {'dot_names': []}

    :return: available dot names
"""
    try:
        # handle get arguments
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise ControllerException('child dot_names can only be requested for one parent dot_name at a time.')
        dot_name = DotName(dot_name_str=dot_names[0])

        dot_names = sorted([str(dn) for dn in get_child_dot_names(parent_dot_name=dot_name)])
        dot_names_response = []
        for dot_name in dot_names:
            dot_name_item = transform_dotname(dot_name)
            dot_names_response.append(dot_name_item)
        return {"dot_names": dot_names_response}


    except ControllerException as e:
        return str(e), 400
