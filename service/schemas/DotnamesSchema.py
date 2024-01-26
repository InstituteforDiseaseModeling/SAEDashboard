from pydantic import BaseModel
from typing import List


class DotnameSchema(BaseModel):
    id: str
    text: str


class DotnamesListSchema(BaseModel):
    dot_names: List[DotnameSchema]