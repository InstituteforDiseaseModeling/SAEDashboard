interface IndicatorConfig {
  [key: string]: {
    unitLabel: string;
    multiper: number;
    unit: string;
    mapLabel: string;
    decimalPt: number;
  };
}

export const IndicatorConfig: IndicatorConfig = {
  'predicted_incidence': {'unitLabel': 'cases_per_1000', 'multiper': 1, 'unit': '',
    'mapLabel': 'cases_per_1000', 'decimalPt': 2},
  'reported_incidence': {'unitLabel': 'cases_per_1000', 'multiper': 1, 'unit': '',
    'mapLabel': 'cases_per_1000', 'decimalPt': 2},
  'CDM': {'unitLabel': 'number_of_nets', 'multiper': 1, 'unit': '', 'mapLabel': 'units',
    'decimalPt': 0},
  'MILDA': {'unitLabel': 'number_of_nets', 'multiper': 1, 'unit': '', 'mapLabel': 'units',
    'decimalPt': 0},
  'CDM_Coverage': {'unitLabel': 'population_coverage_rates', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
  'MILDA_Coverage': {'unitLabel': 'population_coverage_rates', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
  'modern_method': {'unitLabel': 'modern_method', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
  'traditional_method': {'unitLabel': 'traditional_method', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
  'unmet_need': {'unitLabel': 'unmet_need', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
};

