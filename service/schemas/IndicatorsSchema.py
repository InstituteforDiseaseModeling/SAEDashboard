from typing import List, Dict
from pydantic import BaseModel

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
    "reported_incidence": "Reported Incidence"
}

class IndicatorSchema(BaseModel):
    id: str
    text: str
    time: Dict[int, List[int]]


class IndicatorsListSchema(BaseModel):
    indicators: List[IndicatorSchema]
