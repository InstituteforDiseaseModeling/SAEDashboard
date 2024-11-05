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
  'CDM': {'unitLabel': 'number_of_nets', 'multiper': 1, 'unit': '', 'mapLabel': 'CDMLegendLabel',
    'decimalPt': 0},
  'MILDA': {'unitLabel': 'number_of_nets', 'multiper': 1, 'unit': '',
    'mapLabel': 'MILDALegendLabel', 'decimalPt': 0},
  'CDM_Coverage': {'unitLabel': 'population_coverage_rates', 'multiper': 100, 'unit': '%',
    'mapLabel': 'CDMCoverageLegendLabel', 'decimalPt': 0},
  'MILDA_Coverage': {'unitLabel': 'population_coverage_rates', 'multiper': 100, 'unit': '%',
    'mapLabel': 'MILDACoverageLegendLabel', 'decimalPt': 0},
  'modern_method': {'unitLabel': 'modern_method', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
  'traditional_method': {'unitLabel': 'traditional_method', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
  'unmet_need': {'unitLabel': 'unmet_need', 'multiper': 100, 'unit': '%',
    'mapLabel': '%', 'decimalPt': 0},
  'low_model_predictions': {'unitLabel': 'cases_per_1000', 'multiper': 1, 'unit': '',
    'mapLabel': 'cases_per_1000', 'decimalPt': 2},
  'high_model_predictions': {'unitLabel': 'cases_per_1000', 'multiper': 1, 'unit': '',
    'mapLabel': 'cases_per_1000', 'decimalPt': 2},
  'correct_treatment': {'unitLabel': 'correct_treatment', 'multiper': 1, 'unit': '\'%',
    'mapLabel': 'PercentTreatedLegendLabel', 'decimalPt': 1},
  'testing_rates': {'unitLabel': 'testing_rates', 'multiper': 1, 'unit': '\'%',
    'mapLabel': 'TestingRatesLegendLabel', 'decimalPt': 1},
  'SMC': {'unitLabel': 'testing_rates', 'multiper': 1, 'unit': '\'%',
    'mapLabel': 'SMCLegendLabel', 'decimalPt': 1},
  'IPTp3': {'unitLabel': 'testing_rates', 'multiper': 1, 'unit': '\'%',
    'mapLabel': 'IPTPLegendLabel', 'decimalPt': 1},
  'weather_zones': {'unitLabel': 'weather_zones', 'multiper': 1, 'unit': ' mm',
    'mapLabel': 'mm', 'decimalPt': 1},
  'neg_covars': {'unitLabel': 'neg_covars', 'multiper': 1, 'unit': '(mode)',
    'mapLabel': 'neg_covars_map_label', 'decimalPt': 1},
  'pos_covars': {'unitLabel': 'pos_covars', 'multiper': 1, 'unit': '(mode)',
    'mapLabel': 'pos_covars_map_label', 'decimalPt': 1},
  'neg_covars_category': {'unitLabel': 'neg_covars_category', 'multiper': 1, 'unit': '',
    'mapLabel': 'neg_covars_map_label', 'decimalPt': 1},
  'pos_covars_category': {'unitLabel': 'pos_covars_category', 'multiper': 1, 'unit': '',
    'mapLabel': 'pos_covars_map_label', 'decimalPt': 1},
};

