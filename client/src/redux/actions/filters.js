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


/**
 * Select the year shown on the maps.
 * @param {number} year
 * @return {Object} Redux action.
 */
export function changeSelectedYear(year) {
  return {
    type: CHANGE_SELECTED_YEAR,
    year,
  };
}

/**
 * Select the month shown on the maps.
 * @param {number} month
 * @return {Object} Redux action.
 */
export function changeSelectedMonth(month) {
  return {
    type: CHANGE_SELECTED_MONTH,
    month,
  };
}

/**
 * Build an error notification from a failed API response.
 * @param {Object} data
 * @return {Object} Redux action.
 */
function setError(data) {
  const response = data.response;

  return {
    type: SHOW_ERROR,
    variant: 'error',
    msg: (response && response.statusText) ? response.statusText : 'Error occured.',
    open: true,
  };
}

/**
 * Select the country to display.
 * @param {string} selectedCountry
 * @return {Object} Redux action.
 */
export function changeSelectedCountry(selectedCountry) {
  return {
    type: CHANGE_SELECTED_COUNTRY,
    selectedCountry,
  };
}

/**
 * Toggle between admin level 1 and admin level 2 shapes.
 * @param {boolean} isAdm3
 * @return {Object} Redux action.
 */
export function changeIsAdm3(isAdm3) {
  return {
    type: CHANGE_ISADM3,
    isAdm3,
  };
}

/**
 * Select the map legend.
 * @param {string} selectedLegend
 * @return {Object} Redux action.
 */
export function changeSelectedLegend(selectedLegend) {
  return {
    type: CHANGE_LEGEND,
    selectedLegend,
  };
}

/**
 * Select the year for the comparison map.
 * @param {number} selectedYear
 * @return {Object} Redux action.
 */
export function changeCompareYearFilter(selectedYear) {
  return {
    type: CHANGE_COMPARE_YEAR,
    selectedYear,
  };
}

/**
 * Select a region on the primary map.
 * @param {string} state
 * @return {Object} Redux action.
 */
export function changeSelectedState(state) {
  return {
    type: CHANGE_SELECTED_STATE,
    state,
  };
}

/**
 * Select a region on the comparison map.
 * @param {string} state
 * @return {Object} Redux action.
 */
export function changeSelectedComparisonState(state) {
  return {
    type: CHANGE_SELECTED_COMPARISON_STATE,
    state,
  };
}

/**
 * Select the primary indicator.
 * @param {string} selectedIndicator
 * @return {Object} Redux action.
 */
export function changeSelectedIndicator(selectedIndicator) {
  return {
    type: CHANGE_SELECTED_INDICATOR,
    selectedIndicator,
  };
}

/**
 * Select the comparison indicator.
 * @param {string} selectedComparisonIndicator
 * @return {Object} Redux action.
 */
export function changeSelectedComparisonIndicator(selectedComparisonIndicator) {
  return {
    type: CHANGE_SELECTED_COMPARISON_INDICATOR,
    selectedComparisonIndicator,
  };
}

/**
 * Set the color theme used for an indicator.
 * @param {string} indicator
 * @param {string} colorTheme
 * @return {Object} Redux action.
 */
export function changeIndicatorColorTheme(indicator, colorTheme) {
  return {
    type: CHANGE_INDICATOR_COLOR_THEME,
    indicator,
    colorTheme,
  };
}

/**
 * Select the primary map color theme.
 * @param {string} selectedMapTheme
 * @return {Object} Redux action.
 */
export function changeSelectedMapTheme(selectedMapTheme) {
  return {
    type: CHANGE_SELECTED_MAP_THEME,
    selectedMapTheme,
  };
}

/**
 * Select the comparison map color theme.
 * @param {string} selectedComparisonMapTheme
 * @return {Object} Redux action.
 */
export function changeSelectedComparisonMapTheme(selectedComparisonMapTheme) {
  return {
    type: CHANGE_SELECTED_COMPARISON_MAP_THEME,
    selectedComparisonMapTheme,
  };
}

/**
 * Set the maximum value of the map legend.
 * @param {number} mapLegendMax
 * @return {Object} Redux action.
 */
export function changeMapLegendMax(mapLegendMax) {
  return {
    type: CHANGE_MAP_LEGEND_MAX,
    mapLegendMax,
  };
}

/**
 * Set the minimum value of the map legend.
 * @param {number} mapLegendMin
 * @return {Object} Redux action.
 */
export function changeMapLegendMin(mapLegendMin) {
  return {
    type: CHANGE_MAP_LEGEND_MIN,
    mapLegendMin,
  };
}

/**
 * Toggle the difference map.
 * @param {boolean} diffMap
 * @return {Object} Redux action.
 */
export function changeDiffMap(diffMap) {
  return {
    type: CHANGE_DIFF_MAP,
    diffMap,
  };
}

/**
 * Toggle syncing legends between the two maps.
 * @param {boolean} legendSync
 * @return {Object} Redux action.
 */
export function changeLegendSync(legendSync) {
  return {
    type: CHANGE_LEGEND_SYNC,
    legendSync,
  };
}

/**
 * Store the indicator list returned by the service.
 * @param {Object} indicatorData
 * @return {Object} Redux action.
 */
export function setIndicatorData(indicatorData) {
  return {
    type: SET_INDICATOR_DATA,
    indicatorData,
  };
}

/**
 * Store the subgroup list returned by the service.
 * @param {Object} subgroupsData
 * @return {Object} Redux action.
 */
export function setMapSubgroupsData(subgroupsData) {
  return {
    type: SET_MAP_SUBGROUPS_DATA,
    subgroupsData,
  };
}

/**
 * Store the country list returned by the service.
 * @param {Object} countryData
 * @return {Object} Redux action.
 */
export function setCountryData(countryData) {
  return {
    type: SET_COUNTRY_DATA,
    countryData,
  };
}

/**
 * Fetch indicators available under a location.
 * @param {string} dotName
 * @param {boolean} isAdm3
 * @return {Object} API middleware action.
 */
export function fetchIndicatorData(dotName, isAdm3) {
  return apiAction({
    url: '/indicators?dot_name=' + dotName + '&use_descendant_dot_names=True',
    onSuccess: setIndicatorData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

/**
 * Fetch subgroups available under a location.
 * @param {string} dotName
 * @param {boolean} isAdm3
 * @return {Object} API middleware action.
 */
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

/**
 * Fetch the list of countries.
 * @param {boolean} isAdm3
 * @return {Object} API middleware action.
 */
export function fetchCountryData(isAdm3) {
  return apiAction({
    url: '/dot_names?dot_name=Africa&admin_level=' + (isAdm3?2:1),
    onSuccess: setCountryData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

/**
 * Change the UI language.
 * @param {string} language
 * @return {Object} Redux action.
 */
export function changeLanguage(language) {
  return {
    type: CHANGE_LANGUAGE,
    language,
  };
}

/**
 * Select the subgroup for the primary indicator.
 * @param {string} selectedSubgroup
 * @return {Object} Redux action.
 */
export function changeSelectedSubgroup(selectedSubgroup) {
  return {
    type: CHANGE_SELECTED_SUBGROUP,
    selectedSubgroup,
  };
}

/**
 * Select the subgroup for the comparison indicator.
 * @param {string} selectedComparisonSubgroup
 * @return {Object} Redux action.
 */
export function changeSelectedComparisonSubgroup(selectedComparisonSubgroup) {
  return {
    type: CHANGE_SELECTED_COMPARISON_SUBGROUP,
    selectedComparisonSubgroup,
  };
}
