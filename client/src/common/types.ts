import { Type } from "@amcharts/amcharts4/.internal/core/utils/Type"

export type HealthClinic = {
  CODE: string,
  ALT: string,
  TYPE: string,
  GPS_2_Source: string,
  Lat_2: number,
  Long_2: number,
  Fraction_unique: number,
  Fraction_polygenomic: number,
  repeated_twice: number,
  repeated_multiple: number,
  heterozygosity: number,
}

export type MapData = {
  id: string,
  value: number,
}