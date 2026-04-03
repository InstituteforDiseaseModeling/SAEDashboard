from typing import Any, List, Optional
from pydantic import BaseModel


class LayerSummary(BaseModel):
    id: str
    type: str         # "point-data" | "image"
    label: str
    years: List[str]  # sorted year values; empty list for single-year or image layers


class LayersListSchema(BaseModel):
    layers: List[LayerSummary]


class LayerDataResponse(BaseModel):
    id: str
    type: str            # "point-data" | "image"
    label: str
    data: Optional[Any]  # point-data: { "SITE": {...} } or { "2019": { "SITE": {...} }, ... }
    url: Optional[str]   # image: "/layer/download?id={id}"
