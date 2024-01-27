import {
  FETCH_DASHBOARD_DATA,
  FETCH_HEALTH_CLINIC_DATA,
  FETCH_EVENT_DATA,
  SET_GEOJSON_DATA,
  SET_HEALTH_CLINIC_DATA,
  SET_EVENT_DATA,
  SHOW_ERROR,
} from './types';
import {apiAction} from './api';

import AfricaAdm2Json from '../../data/Africa_shape_adm2.json';
import AfricaAdm3Json from '../../data/Africa_shape_adm3.json';


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
 * for setting Africa geoJson action
 * @param {string} isAdm3 - indicate whether it is for Adm3
 * @return {object} Africa geoJson action object
 */
export function setAfricaGeoJsonData(isAdm3) {
  return {
    type: SET_GEOJSON_DATA,
    geoJson: isAdm3 ? AfricaAdm3Json : AfricaAdm2Json,
  };
}

/**
 * for setting health clinic data
 * @param {object} healthClinicData - health clinic data
 * @return {object} health clinic action object
 */
export function setHealthClinicData(healthClinicData) {
  return {
    type: SET_HEALTH_CLINIC_DATA,
    healthClinicData: healthClinicData,
  };
}

/**
 * for setting event data
 * @param {object} eventData - event data
 * @return {object} eventData action object
 */
export function setEventData(eventData) {
  return {
    type: SET_EVENT_DATA,
    eventData: eventData,
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
  if (dotName==='Africa') {
    return (setAfricaGeoJsonData(isAdm3));
  } else {
    return apiAction({
      url: dotName!=='Africa' && dotName ? '/shapes?dot_name=' + dotName +
        '&admin_level=' + (isAdm3?3:2) : '/africa_map' + '?admin_level=' + (isAdm3?3:2),
      onSuccess: setGeoJsonData,
      onFailure: setError,
      label: FETCH_DASHBOARD_DATA,
      headers: {'Access-Control-Allow-Origin': '*'},
    });
  }
}

/**
 * Fetch health clinic data
 * @return {*} api action object
 */
export function fetchHealthClinicData() {
  return apiAction({
    url: '/health_clinics/',
    method: 'GET',
    onSuccess: setHealthClinicData,
    onFailure: setError,
    label: FETCH_HEALTH_CLINIC_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

/**
 * Fetch events data
 * @return {*} api action object
 */
export function fetchEventData() {
  return apiAction({
    url: '/events/',
    onSuccess: setEventData,
    onFailure: setError,
    label: FETCH_EVENT_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}
