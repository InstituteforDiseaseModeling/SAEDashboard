from typing import List, Dict, Optional
from pydantic import BaseModel

from service.schemas.ConfigSchema import IndicatorConfigSchema


class IndicatorSchema(BaseModel):
    id: str
    text: str
    version: int
    admin_levels: List[int]
    subgroups: List[str]
    time: Dict[int, List[int]]
    color_theme: Optional[str] = None
    config: Optional[IndicatorConfigSchema] = None


class IndicatorsListSchema(BaseModel):
    indicators: List[IndicatorSchema]
