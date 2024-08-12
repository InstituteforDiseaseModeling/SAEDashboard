from service.helpers.controller_helpers import ControllerException, read_dot_names, get_channels, \
    read_admin_level, read_use_descendant_dot_names
from service.helpers.dot_name import DotName
from service.schemas.IndicatorsSchema import IndicatorsListSchema
from fastapi import APIRouter, Request

router = APIRouter()

LABELS = {
    "NoU5": "No children under 5 (NoU5)",
    "Parity0": "No children (Parity0)",
    "UnVx": "Majority of children under 5 unvaccinated (UnVx)",
    "Vx": "Majority of children vaccinated (Vx)",
    "unmet_need_limit": "Unmet need for limiting",
    "unmet_need_space": "Unmet need for spacing",
    "ALL_STD": "All STD",
    "CDM_Coverage": "CDM - Population Coverage Rates",
    "MILDA_Coverage": "MILDA - Population Coverage Rates",
    "CDM": "CDM - Number of Nets",
    "MILDA": "MILDA - Number of Nets",
    "predicted_incidence": "Predicted Incidence",
    "reported_incidence": "Reported Incidence",
    "SMC": "Seasonal Malaria Chemoprophylaxis Coverage",
    "IPTp3": "Intermittent Preventative Treatment in Pregnancy",
    "testing_rates": "Tested Suspected Malaria Cases",
    "correct_treatment": "% Cases with Correct Treatment"
}


def generate_label(indicator):
    # if we have a specific display name known, use it
    label = LABELS.get(indicator, None)
    if label is None:
        # generate a display name according to a standard set of rules
        label = " ".join(p.capitalize() for p in indicator.split('_'))
    return label


@router.get("/indicators", response_model=IndicatorsListSchema)
async def get_indicators(request: Request):
    """
    Example 1: /indicators?dot_name=Africa:Benin:Borgou
    return:
        {
            'indicators': [
                 {"id": 'traditional_method', "text":"Traditional Method"},
                 ...
             ]
        }

    Example 2:
    /indicators?dot_name=Africa:Benin   (no data at this level, no exact dot-name matching)
    indicators =
        "indicators": [
            { "id": "modern_method", "text": "Modern Method" },
            ...
        ]
    :return: indicators
    """

    try:
        # handle get arguments
        dot_names = read_dot_names(request=request)
        if len(dot_names) > 1:
            raise ControllerException('indicators can only be requested for one dot_name at a time.')
        dot_name = DotName(dot_name_str=dot_names[0])
        use_descendant_dot_names = read_use_descendant_dot_names(request=request)
        requested_admin_level = read_admin_level(request=request, required=False)
        if requested_admin_level is not None:
            if requested_admin_level < dot_name.admin_level:
                raise ControllerException('Cannot request an admin_level shallower than the provided dot_name.')

        # # TODO: no version check here
        indicators = sorted(get_channels(dot_name=dot_name, use_descendent_dot_names=use_descendant_dot_names,
                                         admin_level=requested_admin_level))
        indicators_response = []
        for ind in indicators:
            label = generate_label(ind)
            indicators_response.append({"id": ind, "text": label})

        return {"indicators": indicators_response}

    except ControllerException as e:
        return str(e), 400

