from pydantic import BaseModel
from typing import List

LABELS = {
    "all": "all_ages",
    "25plus_rural": "Women 25+, Rural",
    "25plus_urban": "Women 25+, Urban",
    "15-24_urban": "Women 15-24, Urban",
    "15-24_rural": "Women 15-24, Rural",
    "15-24": "Women 15-24",
    "25plus": "Women 25+",
    "15-24_Parity-0": "Women 15-24, Parity 0",
    "15-24_Parity-1plus": "Women 15-24, Parity 1+",
    "25plus_Parity-0": "Women 25+, Parity 0",
    "25plus_Parity-1": "Women 25+, Parity 1",
    "25plus_Parity-1plus": "Women 25+, Parity 1+",
    "Parity-0": "Parity 0",
    "Parity-1plus": "Parity 1+",
    'all-1': 'All-1',
    'all-NA': 'All-NA',
    'rural': 'Rural',
    'urban': 'Urban'
}

class SubgroupSchema(BaseModel):
    id: str
    text: str


class SubgroupsListSchema(BaseModel):
    subgroups: List[SubgroupSchema]
