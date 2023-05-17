import {
  FETCH_DASHBOARD_DATA,
  SET_GEOJSON_DATA,
  SHOW_ERROR,
} from './types';
import {apiAction} from './api';


/**
 * for setting geoJson action
 * @param {object} geoJson - map data in geo json
 * @return {object} geoJson action object
 */
export function setGeoJsonData(geoJson) {
  return {
    type: SET_GEOJSON_DATA,
    geoJson,
  };
}


/**
 * for raising error
 * @param {*} data error data
 * @return {*} error action object
 */
function setError(data) {
  const response = data.response;

  return {
    type: SHOW_ERROR,
    variant: 'error',
    msg: response.statusText ? response.statusText : 'Error occured.',
    open: true,
  };
}


/**
 * Fetch geoJson data
 * @param {*} dotName - dot name
 * @param {*} isAdm3 - whether it is for admin3
 * @return {*} api action object
 */
export function fetchGeoJsonData(dotName, isAdm3) {
  return apiAction({
    url: dotName!=='Africa' && dotName ? '/shapes?dot_name=' + dotName +
      '&admin_level=' + (isAdm3?3:2) : '/africa_map' + '?admin_level=' + (isAdm3?3:2),
    onSuccess: setGeoJsonData,
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}
