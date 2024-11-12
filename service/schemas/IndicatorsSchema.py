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
    "reported_incidence": "Reported Incidence",
    "low_model_predictions": "Low Model Predictions",
    "high_model_predictions": "High Model Predictions",
    "SMC": "Seasonal Malaria Chemoprophylaxis Coverage",
    "IPTp3": "Intermittent Preventative Treatment in Pregnancy",
    "testing_rates": "Tested Suspected Malaria Cases",
    "correct_treatment": "% Cases with Correct Treatment",
    "weather_zones": "Weather Zones",
    "gambiae": "Mosquito Species"
}

class IndicatorSchema(BaseModel):
    id: str
    text: str
    version: int
    time: Dict[int, List[int]]


class IndicatorsListSchema(BaseModel):
    indicators: List[IndicatorSchema]
