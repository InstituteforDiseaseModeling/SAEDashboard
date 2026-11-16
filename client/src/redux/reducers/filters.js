import {
  CHANGE_ISADM3,
  CHANGE_MAP_LEGEND_MAX,
  CHANGE_MAP_LEGEND_MIN,
  CHANGE_SELECTED_COUNTRY,
  CHANGE_SELECTED_INDICATOR,
  CHANGE_SELECTED_COMPARISON_INDICATOR,
  CHANGE_INDICATOR_COLOR_THEME,
  CHANGE_SELECTED_MAP_THEME,
  CHANGE_SELECTED_COMPARISON_MAP_THEME,
  CHANGE_SELECTED_STATE,
  CHANGE_SELECTED_COMPARISON_STATE,
  CHANGE_SELECTED_YEAR,
  CHANGE_SELECTED_MONTH,
  CHANGE_LEGEND,
  CHANGE_COMPARE_YEAR,
  CHANGE_DIFF_MAP,
  CHANGE_LEGEND_SYNC,
  CHANGE_LANGUAGE,
  SET_COUNTRY_DATA,
  SET_INDICATOR_DATA,
  SET_MAP_SUBGROUPS_DATA,
  SET_YEAR_SLIDER_DATA,
  CHANGE_SELECTED_SUBGROUP,
  CHANGE_SELECTED_COMPARISON_SUBGROUP,
} from '../actions/types';

import * as _ from 'lodash';
import config from '../../app_config.json';
import {AFRICA_STR} from '../../const';

const initialState = {
  selectedState: config.defaultRegion,
  selectedComparisonState: config.defaultRegion,
  selectedCountry: config.defaultCountry,
  selectedYear: config.defaultYear,
  selectedMonth: null,
  selectedLegend: false,
  selectedDiffMap: false,
  selectedLegendSync: false,
  isAdm3: false,

  countries: [],
  indicators: [],
  mapSubgroups: [],
  selectedLanguage: sessionStorage.getItem('selectedLanguage') || 'en',

  fromYear: 0,
  toYear: 0,
  currentYear: config.defaultYear ? config.defaultYear : 2023,
  currentMonth: null,
  mapLegendMax: 0.25,
  mapLegendMin: 0,
  initialLoading: true,
};

const withDataAdminLevel = (state) => {
  if (state.selectedCountry === AFRICA_STR) {
    return state.isAdm3 ? {...state, isAdm3: false, selectedState: null} : state;
  }
  const levels = _.get(_.find(state.indicators, {id: state.selectedIndicator}), 'admin_levels', []);
  const currentLevel = state.isAdm3 ? 2 : 1;
  if (levels.length === 0 || levels.includes(currentLevel)) return state;
  const isAdm3 = !levels.includes(1);
  return {...state, isAdm3, selectedState: null};
};

/**
 * Reducer for dashboard filter selections and indicator lists.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} Next state.
 */
export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SELECTED_YEAR:
      return {...state, currentYear: action.year};

    case CHANGE_SELECTED_MONTH:
      return {...state, currentMonth: action.month};

    case CHANGE_SELECTED_COUNTRY:
      return {
        ...state,
        selectedCountry: action.selectedCountry,
        isAdm3: action.selectedCountry === AFRICA_STR ? false : state.isAdm3,
        selectedState: null,
        selectedComparisonState: null,
        indicators: [],
        selectedSubgroup: null,
        selectedComparisonSubgroup: null,
      };

    case CHANGE_SELECTED_STATE:
      return {...state, selectedState: action.state};

    case CHANGE_SELECTED_COMPARISON_STATE:
      return {...state, selectedComparisonState: action.state};

    case CHANGE_SELECTED_INDICATOR:
      return withDataAdminLevel({...state, selectedIndicator: action.selectedIndicator});

    case CHANGE_SELECTED_COMPARISON_INDICATOR:
      return {...state, selectedComparisonIndicator: action.selectedComparisonIndicator};

    case CHANGE_INDICATOR_COLOR_THEME:
      return {...state, indicators: state.indicators.map((indicator) =>
        indicator.id === action.indicator ?
          {...indicator, color_theme: action.colorTheme} :
          indicator,
      )};

    case CHANGE_SELECTED_MAP_THEME:
      return {...state, selectedMapTheme: action.selectedMapTheme};

    case CHANGE_SELECTED_COMPARISON_MAP_THEME:
      return {...state, selectedComparisonMapTheme: action.selectedComparisonMapTheme};

    case CHANGE_MAP_LEGEND_MAX:
      return {...state, mapLegendMax: action.mapLegendMax};

    case CHANGE_MAP_LEGEND_MIN:
      return {...state, mapLegendMin: action.mapLegendMin};

    case SET_YEAR_SLIDER_DATA:
      return {...state, fromYear: action.fromYear, toYear: action.toYear};

    case SET_INDICATOR_DATA:
      const indicators = action.indicatorData['indicators'].filter((indicator) =>
        state.selectedCountry !== AFRICA_STR ||
        _.isEmpty(indicator.admin_levels) ||
        indicator.admin_levels.includes(1));
      indicators.forEach((indicator) => {
        indicator.subgroups.sort();
        const real = indicator.subgroups.filter((s) => s !== 'all');
        indicator.subgroups = real.length > 0 ? real : indicator.subgroups;
      });

      const prevIndicator = state.selectedIndicator;
      const prevComparisonIndicator = state.selectedComparisonIndicator;
      const foundPrev = prevIndicator && _.find(indicators, {id: prevIndicator});
      const foundPrevComp = prevComparisonIndicator &&
        _.find(indicators, {id: prevComparisonIndicator});
      const foundTarget =_.find(indicators, {id: config.defaultIndicator});
      const found2ndTarget =_.find(indicators, {id: config.defaultComparisonIndicator});

      const selectedIndicator = indicators.length > 0 ?
        foundPrev ? foundPrev.id :
        foundTarget ? foundTarget.id : indicators[0].id :
        null;

      const selectedComparisonIndicator = indicators.length > 0 ?
        foundPrevComp ? foundPrevComp.id :
        found2ndTarget ? found2ndTarget.id :
        (indicators.length > 1 ? indicators[1].id : indicators[0].id) :
        null;

      return withDataAdminLevel({...state, indicators: indicators,
        selectedComparisonIndicator: selectedComparisonIndicator,
        selectedIndicator: selectedIndicator});

    case SET_MAP_SUBGROUPS_DATA:
      const subGroups = _.sortBy(action.subgroupsData['subgroups'], ['id']);
      return {...state, mapSubgroups: subGroups};

    case SET_COUNTRY_DATA:
      const countries = [
        {'id': 'Africa', 'text': 'Africa (all countries)'},
        ...action.countryData['dot_names'],
      ];
      return {...state, countries: countries};

    case CHANGE_ISADM3:
      return {
        ...state,
        selectedState: null,
        isAdm3: state.selectedCountry === AFRICA_STR ? false : action.isAdm3,
      };

    case CHANGE_LEGEND:

      state.selectedLegend = null;
      return {...state, selectedLegend: action.selectedLegend};

    case CHANGE_COMPARE_YEAR:
      return {...state, selectedYear: action.selectedYear};

    case CHANGE_DIFF_MAP:
      return {...state, selectedDiffMap: action.diffMap};

    case CHANGE_LEGEND_SYNC:
      return {...state, selectedLegendSync: action.legendSync};

    case CHANGE_LANGUAGE:
      sessionStorage.setItem('selectedLanguage', action.language);
      return {...state, selectedLanguage: action.language};

    case CHANGE_SELECTED_SUBGROUP:
      return {...state, selectedSubgroup: action.selectedSubgroup};

    case CHANGE_SELECTED_COMPARISON_SUBGROUP:
      return {...state, selectedComparisonSubgroup: action.selectedComparisonSubgroup};

    default:
      return state;
  }
}
