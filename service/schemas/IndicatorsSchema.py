from typing import List
from pydantic import BaseModel


class IndicatorSchema(BaseModel):
    id: str
    text: str


class IndicatorsListSchema(BaseModel):
    indicators: List[IndicatorSchema]