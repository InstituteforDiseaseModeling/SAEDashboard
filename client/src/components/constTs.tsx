export interface IndicatorMeta {
  theme?: string;
  shapefileVersion?: number;
  unitLabel?: string;
  multiper?: number;
  unit?: string;
  mapLabel?: string;
  decimalPt?: number;
  legendLabel?: string;
  useAvg?: boolean;
  mainSpeciesName?: string;
  rasterFile?: string;
  extraInfo?: boolean;
  extraInfoEn?: string;
  extraInfoFr?: string;
  chartType?: string;
  yAxisLabel?: string;
  ignoreOthers?: boolean;
  dataSourceEn?: string;
  dataSourceFr?: string;
  group?: string;
  groupOrder?: number;
}

export type IndicatorConfigMap = Record<string, IndicatorMeta>;
