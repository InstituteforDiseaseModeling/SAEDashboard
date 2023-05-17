import {
  CHANGE_SELECTED_STATE,
  CHANGE_SELECTED_YEAR,
  CHANGE_SELECTED_INDICATOR,
  CHANGE_SELECTED_COUNTRY,
  CHANGE_SELECTED_MAP_THEME,
  CHANGE_MAP_LEGEND_MAX,
  CHANGE_ISADM3,
  FETCH_DASHBOARD_DATA,
  SET_INDICATOR_DATA,
  SET_MAP_SUBGROUPS_DATA,
  SET_COUNTRY_DATA,
  SHOW_ERROR,
} from './types';
import {apiAction} from './api';
import {AFRICA_STR} from '../../const';


/**
 * get change selected year message
 * @param {*} year
 * @return {*} change year message
 */
export function changeSelectedYear(year) {
  return {
    type: CHANGE_SELECTED_YEAR,
    year,
  };
}

/**
 * get setting error message
 * @param {*} data
 * @return {*} error message
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
 * change selected country
 * @param {*} selectedCountry
 * @return {*} selectedCountry message
 */
export function changeSelectedCountry(selectedCountry) {
  return {
    type: CHANGE_SELECTED_COUNTRY,
    selectedCountry,
  };
}

/**
 * change isAdm3 indicator
 * @param {*} isAdm3
 * @return {*} isAdm3 message
 */
export function changeIsAdm3(isAdm3) {
  return {
    type: CHANGE_ISADM3,
    isAdm3,
  };
}


/**
 * change selected country state / region
 * @param {*} state
 * @return {*} selected state message
 */
export function changeSelectedState(state) {
  return {
    type: CHANGE_SELECTED_STATE,
    state,
  };
}

/**
 * change selected indicator
 * @param {*} selectedIndicator
 * @return {*} selected indicator message
 */
export function changeSelectedIndicator(selectedIndicator) {
  return {
    type: CHANGE_SELECTED_INDICATOR,
    selectedIndicator,
  };
}

/**
 * change selected map color theme
 * @param {*} selectedMapTheme
 * @return {*} change selected map color theme message
 */
export function changeSelectedMapTheme(selectedMapTheme) {
  return {
    type: CHANGE_SELECTED_MAP_THEME,
    selectedMapTheme,
  };
}

/**
 * change mapLegend max value
 * @param {*} mapLegendMax
 * @return {*} change mapLegend max value message
 */
export function changeMapLegendMax(mapLegendMax) {
  return {
    type: CHANGE_MAP_LEGEND_MAX,
    mapLegendMax,
  };
}

/**
 * set indicator
 * @param {*} indicatorData
 * @return {*} set indicator message
 */
export function setIndicatorData(indicatorData) {
  return {
    type: SET_INDICATOR_DATA,
    indicatorData,
  };
}

/**
 * set map subgroups data
 * @param {*} subgroupsData
 * @return {*} set map subgroups data message
 */
export function setMapSubgroupsData(subgroupsData) {
  return {
    type: SET_MAP_SUBGROUPS_DATA,
    subgroupsData,
  };
}

/**
 * set country data
 * @param {*} countryData
 * @return {*} set country data message
 */
export function setCountryData(countryData) {
  return {
    type: SET_COUNTRY_DATA,
    countryData,
  };
}

/**
 * Fetch indicator data
 * @param {*} dotName
 * @param {*} isAdm3
 * @return {*} fetch indicator data message
 */
export function fetchIndicatorData(dotName, isAdm3) {
  return apiAction({
    url: '/indicators?dot_name=' + dotName + '&use_descendant_dot_names=True&admin_level=' +
      (isAdm3?3:2),
    onSuccess: setIndicatorData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

/**
 * Fetch subgroup data
 * @param {*} dotName
 * @param {*} isAdm3
 * @return {*} fetch subgroup data message
 */
export function fetchMapSubgroupData(dotName=AFRICA_STR, isAdm3) {
  return apiAction({
    url: '/subgroups?dot_name=' + dotName + '&use_descendant_dot_names=True&admin_level=' +
      (isAdm3?3:2),
    onSuccess: setMapSubgroupsData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}


/**
 * Fetch country data
 * @param {*} isAdm3
 * @return {*} Fetch country data message
 */
export function fetchCountryData(isAdm3) {
  return apiAction({
    url: '/dot_names?dot_name=Africa&admin_level=' + (isAdm3?3:2),
    onSuccess: setCountryData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}
