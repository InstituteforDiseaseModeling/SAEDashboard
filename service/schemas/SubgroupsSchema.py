from pydantic import BaseModel
from typing import List


class SubgroupSchema(BaseModel):
    id: str
    text: str


class SubgroupsListSchema(BaseModel):
    subgroups: List[SubgroupSchema]
