from typing import Dict, List, Optional
from pydantic import BaseModel


class IndicatorConfigSchema(BaseModel):
    theme: Optional[str] = None
    shapefileVersion: Optional[int] = None
    unitLabel: Optional[str] = None
    multiper: Optional[float] = None
    unit: Optional[str] = None
    mapLabel: Optional[str] = None
    decimalPt: Optional[int] = None
    legendLabel: Optional[str] = None
    useAvg: Optional[bool] = None
    mainSpeciesName: Optional[str] = None
    rasterFile: Optional[str] = None
    extraInfo: Optional[bool] = None
    extraInfoEn: Optional[str] = None
    extraInfoFr: Optional[str] = None
    chartType: Optional[str] = None
    yAxisLabel: Optional[str] = None
    ignoreOthers: Optional[bool] = None
    dataSourceEn: Optional[str] = None
    dataSourceFr: Optional[str] = None
    group: Optional[str] = None
    groupOrder: Optional[int] = None


class AppConfigSchema(BaseModel):
    title: str
    disableAdmin2: bool = False
    indicatorGroups: List[str] = []
    defaultYear: Optional[int] = None
    defaultRegion: str = ""
    defaultCountry: str = ""
    defaultIndicator: str = ""
    defaultComparisonIndicator: str = ""


class FullConfigSchema(BaseModel):
    app: AppConfigSchema
    indicators: Dict[str, IndicatorConfigSchema]
