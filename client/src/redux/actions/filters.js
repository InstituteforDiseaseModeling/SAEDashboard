import {
  CHANGE_SELECTED_STATE,
  CHANGE_SELECTED_COMPARISON_STATE,
  CHANGE_SELECTED_YEAR,
  CHANGE_SELECTED_MONTH,
  CHANGE_SELECTED_INDICATOR,
  CHANGE_SELECTED_COMPARISON_INDICATOR,
  CHANGE_SELECTED_SUBGROUP,
  CHANGE_SELECTED_COMPARISON_SUBGROUP,
  CHANGE_SELECTED_COUNTRY,
  CHANGE_INDICATOR_COLOR_THEME,
  CHANGE_SELECTED_MAP_THEME,
  CHANGE_SELECTED_COMPARISON_MAP_THEME,
  CHANGE_MAP_LEGEND_MAX,
  CHANGE_MAP_LEGEND_MIN,
  CHANGE_ISADM3,
  CHANGE_LEGEND,
  CHANGE_COMPARE_YEAR,
  CHANGE_DIFF_MAP,
  CHANGE_LEGEND_SYNC,
  CHANGE_LANGUAGE,
  FETCH_DASHBOARD_DATA,
  SET_INDICATOR_DATA,
  SET_MAP_SUBGROUPS_DATA,
  SET_COUNTRY_DATA,
  SHOW_ERROR,
} from './types';
import {apiAction} from './api';
import {AFRICA_STR} from '../../const';


export function changeSelectedYear(year) {
  return {
    type: CHANGE_SELECTED_YEAR,
    year,
  };
}

export function changeSelectedMonth(month) {
  return {
    type: CHANGE_SELECTED_MONTH,
    month,
  };
}

function setError(data) {
  const response = data.response;

  return {
    type: SHOW_ERROR,
    variant: 'error',
    msg: (response && response.statusText) ? response.statusText : 'Error occured.',
    open: true,
  };
}

export function changeSelectedCountry(selectedCountry) {
  return {
    type: CHANGE_SELECTED_COUNTRY,
    selectedCountry,
  };
}

export function changeIsAdm3(isAdm3) {
  return {
    type: CHANGE_ISADM3,
    isAdm3,
  };
}

export function changeSelectedLegend(selectedLegend) {
  return {
    type: CHANGE_LEGEND,
    selectedLegend,
  };
}

export function changeCompareYearFilter(selectedYear) {
  return {
    type: CHANGE_COMPARE_YEAR,
    selectedYear,
  };
}

export function changeSelectedState(state) {
  return {
    type: CHANGE_SELECTED_STATE,
    state,
  };
}

export function changeSelectedComparisonState(state) {
  return {
    type: CHANGE_SELECTED_COMPARISON_STATE,
    state,
  };
}

export function changeSelectedIndicator(selectedIndicator) {
  return {
    type: CHANGE_SELECTED_INDICATOR,
    selectedIndicator,
  };
}

export function changeSelectedComparisonIndicator(selectedComparisonIndicator) {
  return {
    type: CHANGE_SELECTED_COMPARISON_INDICATOR,
    selectedComparisonIndicator,
  };
}

export function changeIndicatorColorTheme(indicator, colorTheme) {
  return {
    type: CHANGE_INDICATOR_COLOR_THEME,
    indicator,
    colorTheme,
  };
}

export function changeSelectedMapTheme(selectedMapTheme) {
  return {
    type: CHANGE_SELECTED_MAP_THEME,
    selectedMapTheme,
  };
}

export function changeSelectedComparisonMapTheme(selectedComparisonMapTheme) {
  return {
    type: CHANGE_SELECTED_COMPARISON_MAP_THEME,
    selectedComparisonMapTheme,
  };
}

export function changeMapLegendMax(mapLegendMax) {
  return {
    type: CHANGE_MAP_LEGEND_MAX,
    mapLegendMax,
  };
}

export function changeMapLegendMin(mapLegendMin) {
  return {
    type: CHANGE_MAP_LEGEND_MIN,
    mapLegendMin,
  };
}

export function changeDiffMap(diffMap) {
  return {
    type: CHANGE_DIFF_MAP,
    diffMap,
  };
}

export function changeLegendSync(legendSync) {
  return {
    type: CHANGE_LEGEND_SYNC,
    legendSync,
  };
}

export function setIndicatorData(indicatorData) {
  return {
    type: SET_INDICATOR_DATA,
    indicatorData,
  };
}

export function setMapSubgroupsData(subgroupsData) {
  return {
    type: SET_MAP_SUBGROUPS_DATA,
    subgroupsData,
  };
}

export function setCountryData(countryData) {
  return {
    type: SET_COUNTRY_DATA,
    countryData,
  };
}

export function fetchIndicatorData(dotName, isAdm3) {
  return apiAction({
    url: '/indicators?dot_name=' + dotName + '&use_descendant_dot_names=True',
    onSuccess: setIndicatorData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

export function fetchMapSubgroupData(dotName=AFRICA_STR, isAdm3) {
  return apiAction({
    url: '/subgroups?dot_name=' + dotName + '&use_descendant_dot_names=True&admin_level=' +
      (isAdm3?2:1),
    onSuccess: setMapSubgroupsData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

export function fetchCountryData(isAdm3) {
  return apiAction({
    url: '/dot_names?dot_name=Africa&admin_level=' + (isAdm3?2:1),
    onSuccess: setCountryData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

export function changeLanguage(language) {
  return {
    type: CHANGE_LANGUAGE,
    language,
  };
}

export function changeSelectedSubgroup(selectedSubgroup) {
  return {
    type: CHANGE_SELECTED_SUBGROUP,
    selectedSubgroup,
  };
}

export function changeSelectedComparisonSubgroup(selectedComparisonSubgroup) {
  return {
    type: CHANGE_SELECTED_COMPARISON_SUBGROUP,
    selectedComparisonSubgroup,
  };
}
