import {
  CHANGE_ISADM3,
  CHANGE_MAP_LEGEND_MAX,
  CHANGE_MAP_LEGEND_MIN,
  CHANGE_SELECTED_COUNTRY,
  CHANGE_SELECTED_INDICATOR,
  CHANGE_SELECTED_MAP_THEME,
  CHANGE_SELECTED_STATE,
  CHANGE_SELECTED_YEAR,
  CHANGE_LEGEND,
  CHANGE_YEAR_MONTH,
  CHANGE_DIFF_MAP,
  SET_COUNTRY_DATA,
  SET_INDICATOR_DATA,
  SET_MAP_SUBGROUPS_DATA,
  SET_YEAR_SLIDER_DATA,
} from '../actions/types';

import config from '../../app_config.json';
import {AFRICA_STR} from '../../const';

const initialState = {
  selectedState: config.defaultRegion,
  selectedCountry: config.defaultCountry,
  selectedYearMonth: config.defaultYear,
  selectedLegend: true,
  selectedDiffMap: false,
  isAdm3: false,

  countries: [],
  indicators: [],
  mapSubgroups: [],

  fromYear: 0,
  toYear: 0,
  currentYear: config.defaultYear ? config.defaultYear : 2023,
  mapLegendMax: 0.25,
  mapLegendMin: 0,
  initialLoading: true,
};

/**
 * reducer for filter actions
 * @param {*} state
 * @param {*} action
 * @return {*} new filter state
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SELECTED_YEAR:
      return {...state, currentYear: action.year};

    case CHANGE_SELECTED_COUNTRY:
      if (action.selectedCountry === AFRICA_STR) {
        state.isAdm3 = false;
      }

      return {...state, selectedCountry: action.selectedCountry, selectedState: null};

    case CHANGE_SELECTED_STATE:
      return {...state, selectedState: action.state};

    case CHANGE_SELECTED_INDICATOR:
      return {...state, selectedIndicator: action.selectedIndicator};

    case CHANGE_SELECTED_MAP_THEME:
      return {...state, selectedMapTheme: action.selectedMapTheme};

    case CHANGE_MAP_LEGEND_MAX:
      return {...state, mapLegendMax: action.mapLegendMax};

    case CHANGE_MAP_LEGEND_MIN:
      return {...state, mapLegendMin: action.mapLegendMin};

    case SET_YEAR_SLIDER_DATA:
      return {...state, fromYear: action.fromYear, toYear: action.toYear};

    case SET_INDICATOR_DATA:
      // Pick the first indicator as selected
      const indicators = action.indicatorData['indicators'];
      const selectedIndicator = indicators.length > 0 ? indicators[0].id : null;
      return {...state, indicators: indicators, selectedIndicator: selectedIndicator};

    case SET_MAP_SUBGROUPS_DATA:
      // Pick the first subgroup as selected
      const subGroups = action.subgroupsData['subgroups'];
      return {...state, mapSubgroups: subGroups};

    case SET_COUNTRY_DATA:
      // Pick the first subgroup as selected
      const countries = action.countryData['dot_names'];
      // countries.push({'id': 'Africa', 'text': 'View Africa Map'});
      return {...state, countries: countries};

    case CHANGE_ISADM3:

      state.selectedState = null;
      return {...state, isAdm3: action.isAdm3};

    case CHANGE_LEGEND:

      state.selectedLegend = null;
      return {...state, selectedLegend: action.selectedLegend};

    case CHANGE_YEAR_MONTH:

      return {...state, selectedYearMonth: action.selectedYearMonth};

    case CHANGE_DIFF_MAP:

      return {...state, selectedDiffMap: action.diffMap};


    default:
      return state;
  }
}
