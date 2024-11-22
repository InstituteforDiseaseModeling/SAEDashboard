from typing import List, Dict
from pydantic import BaseModel

class IndicatorSchema(BaseModel):
    id: str
    text: str
    version: int
    time: Dict[int, List[int]]


class IndicatorsListSchema(BaseModel):
    indicators: List[IndicatorSchema]
