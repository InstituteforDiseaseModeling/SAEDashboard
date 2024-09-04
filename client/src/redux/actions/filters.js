import {
  CHANGE_SELECTED_STATE,
  CHANGE_SELECTED_YEAR,
  CHANGE_SELECTED_MONTH,
  CHANGE_SELECTED_INDICATOR,
  CHANGE_SELECTED_COMPARISON_INDICATOR,
  CHANGE_SELECTED_COUNTRY,
  CHANGE_SELECTED_MAP_THEME,
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
  CHANGE_SELECTED_RAINFALL_STATION,
  CHANGE_SELECTED_RAINFALL_ZONE,
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
 * get change selected month message
 * @param {*} month
 * @return {*} change month message
 */
export function changeSelectedMonth(month) {
  return {
    type: CHANGE_SELECTED_MONTH,
    month,
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
 * change selected legend indicator
 * true means normal legend and false means custom legend
 * @param {*} selectedLegend
 * @return {*} legend message
 */
export function changeSelectedLegend(selectedLegend) {
  return {
    type: CHANGE_LEGEND,
    selectedLegend,
  };
}


/**
 * change select Year filter in the comparison map filter
 * @param {*} selectedYear
 * @return {*} change year filter message
 */
export function changeCompareYearFilter(selectedYear) {
  return {
    type: CHANGE_COMPARE_YEAR,
    selectedYear,
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
 * change selected comparison indicator
 * @param {*} selectedComparisonIndicator
 * @return {*} selected comparison indicator message
 */
export function changeSelectedComparisonIndicator(selectedComparisonIndicator) {
  return {
    type: CHANGE_SELECTED_COMPARISON_INDICATOR,
    selectedComparisonIndicator,
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
 * change mapLegend min value
 * @param {*} mapLegendMin
 * @return {*} change mapLegend min value message
 */
export function changeMapLegendMin(mapLegendMin) {
  return {
    type: CHANGE_MAP_LEGEND_MIN,
    mapLegendMin,
  };
}

/**
 * toggle diff map value
 * @param {*} diffMap
 * @return {*} change diff map toggle message
 */
export function changeDiffMap(diffMap) {
  return {
    type: CHANGE_DIFF_MAP,
    diffMap,
  };
}

/**
 * toggle legend Sync value
 * @param {*} legendSync
 * @return {*} change legend sync toggle message
 */
export function changeLegendSync(legendSync) {
  return {
    type: CHANGE_LEGEND_SYNC,
    legendSync,
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

/**
 * change language
 * @param {*} language
 * @return {*} set language message
 */
export function changeLanguage(language) {
  return {
    type: CHANGE_LANGUAGE,
    language,
  };
}

/**
 * change selected rainfall station
 * @param {*} rainfallStation
 * @return {*} selected rainfall station message
 */
export function changeSelectedRainfallStation(rainfallStation) {
  return {
    type: CHANGE_SELECTED_RAINFALL_STATION,
    rainfallStation,
  };
};

/**
 * change selected rainfall zone
 * @param {*} rainfallZone
 * @return {*} selected rainfall zone message
 */
export function changeSelectedRainfallZone(rainfallZone) {
  return {
    type: CHANGE_SELECTED_RAINFALL_ZONE,
    rainfallZone,
  };
};

