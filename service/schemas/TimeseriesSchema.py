from typing import Any, Optional, Dict, List
from pydantic import BaseModel, RootModel


class TimeseriesEstimate(BaseModel):
    """
    Represents an estimate for a given year, optionally including additional named breakdowns.

    Attributes:
        year (int): The year of the estimate.
        lower_bound (float): Lower bound of the estimate.
        middle (float): Central estimate or median value.
        upper_bound (float): Upper bound of the estimate.
        others (Optional[Dict[str, float]]): Optional dictionary of additional disaggregated values (e.g., by species).
    """
    year: int
    month: Optional[int] = None
    lower_bound: float
    middle: float
    upper_bound: float
    others: Optional[Dict[str, Any]] = None


class TimeseriesEstimatesList(RootModel[List[TimeseriesEstimate]]):
    """
    A container for a list of yearly estimates.
    """
