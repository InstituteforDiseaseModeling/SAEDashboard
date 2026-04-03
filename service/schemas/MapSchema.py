from typing import Any, List, Dict, Optional
from pydantic import BaseModel, RootModel


class MapSchema(BaseModel):
    """
    Represents a single map value entry for a specific geographic unit.

    Attributes:
        id (str): A unique dot-name identifier for the region
                  (e.g., "Africa:Senegal:Dakar:Centre").
        value (float): The main value to be visualized (e.g., indicator estimate).
        data_lower_bound (float): The lower bound of the estimate (e.g., confidence interval) if provided.
        data_upper_bound (float): The upper bound of the estimate if provided.
        others (Optional[Dict[str, float]]): Optional dictionary of additional disaggregated values (e.g., by species).
    """
    id: str
    value: float
    data_lower_bound: float
    data_upper_bound: float
    others: Optional[Dict[str, Any]] = None

class MapListSchema(RootModel[List[MapSchema]]):
    """
    A container schema for a list of map data values for multiple regions.
    """