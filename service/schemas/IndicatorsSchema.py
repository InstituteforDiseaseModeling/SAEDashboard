from typing import List
from pydantic import BaseModel

LABELS = {
    "NoU5": "No children under 5 (NoU5)",
    "Parity0": "No children (Parity0)",
    "UnVx": "Majority of children under 5 unvaccinated (UnVx)",
    "Vx": "Majority of children vaccinated (Vx)",
    "unmet_need_limit": "Unmet need for limiting",
    "unmet_need_space": "Unmet need for spacing",
    "ALL_STD": "All STD",
    "predicted_incidence": "predicted_incidence",
    "reported_incidence": "reported_incidence"
}

class IndicatorSchema(BaseModel):
    id: str
    text: str


class IndicatorsListSchema(BaseModel):
    indicators: List[IndicatorSchema]
