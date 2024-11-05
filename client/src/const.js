/* constants */
export const AFRICA_STR = 'Africa';

export const DEFAULT_THEME = 'RdBu';

export const DEFAULT_THEMES = ['RdBu', 'BuRd'];

export const IndicatorsToSeriesName = {
  'predicted_incidence': 'median predicted incidence',
  'reported_incidence': 'reported incidence',
};

export const CoVariatesLookup =
[
  {'mode': 1, 'coVariate': 'Accessibility', 'label': 'coVar_Accessibility'},
  {'mode': 2, 'coVariate': 'AI', 'label': 'coVar_AI'},
  {'mode': 3, 'coVariate': 'Distance_to_water', 'label': 'coVar_Distance_to_water'},
  {'mode': 4, 'coVariate': 'Elevation', 'label': 'coVar_Elevation'},
  {'mode': 5, 'coVariate': 'Missing_data', 'label': 'coVar_Missing_data'},
  {'mode': 6, 'coVariate': 'PET', 'label': 'coVar_PET'},
  {'mode': 7, 'coVariate': 'Population', 'label': 'coVar_Population'},
  {'mode': 8, 'coVariate': 'Slope', 'label': 'coVar_Slope'},
  {'mode': 9, 'coVariate': 'TSI', 'label': 'coVar_TSI'},
  {'mode': 10, 'coVariate': 'TWI', 'label': 'coVar_TWI'},
  {'mode': 11, 'coVariate': 'VIIRS', 'label': 'coVar_VIIRS'},
  {'mode': 12, 'coVariate': 'EVI', 'label': 'coVar_EVI'},
  {'mode': 13, 'coVariate': 'LSTDay', 'label': 'coVar_LSTDay'},
  {'mode': 14, 'coVariate': 'LSTNight', 'label': 'coVar_LSTNight'},
  {'mode': 15, 'coVariate': 'TCB', 'label': 'coVar_TCB'},
  {'mode': 16, 'coVariate': 'TCW', 'label': 'coVar_TCW'},
];

export const CoVariatesCategoryLookup =
[
  {'category': 1, 'coVariate': 'Hydrology', 'label': 'coVar_Hydrology_short'},
  {'category': 2, 'coVariate': 'Temperature', 'label': 'coVar_Temperature_short'},
  {'category': 3, 'coVariate': 'Topography', 'label': 'coVar_Topography_short'},
  {'category': 4, 'coVariate': 'Urban/rural', 'label': 'coVar_Urban/rural_short'},
  {'category': 5, 'coVariate': 'Vegetation', 'label': 'coVar_Vegetation_short'},
];
