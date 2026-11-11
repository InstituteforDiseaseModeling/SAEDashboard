import {
  FETCH_DASHBOARD_DATA,
  FETCH_LAYER_DATA,
  FETCH_EVENT_DATA,
  SET_LAYER_DATA,
  SET_EVENT_DATA,
  SHOW_ERROR,
  SET_GEOJSON_DATA_PRIMARY,
  SET_GEOJSON_DATA_COMPARISON,
} from './types';
import {apiAction} from './api';


export function setGeoJsonPrimary(geoJson) {
  return {
    type: SET_GEOJSON_DATA_PRIMARY,
    geoJson,
  };
}

export function setGeoJsonComparison(geoJson) {
  return {
    type: SET_GEOJSON_DATA_COMPARISON,
    geoJson,
  };
}

export function setLayerData(layerData) {
  return {
    type: SET_LAYER_DATA,
    layerData: layerData,
  };
}

export function setEventData(eventData) {
  return {
    type: SET_EVENT_DATA,
    eventData: eventData,
  };
}

function setError(data) {
  const response = data.response;

  return {
    type: SHOW_ERROR,
    variant: 'error',
    msg: response ? response.statusText : 'Error occured.',
    open: true,
  };
}


export function fetchGeoJsonData(dotName, isAdm3, isPrimary, shapeVersion=1) {
  const url = dotName === 'Africa'
    ? '/africa_map/?admin_level=' + (isAdm3 ? 2 : 1)
    : '/shapes?dot_name=' + dotName + '&admin_level=' + (isAdm3 ? 2 : 1) +
      '&shape_version=' + shapeVersion + '&primary=' + isPrimary;
  return apiAction({
    url,
    onSuccess: (geoJson) => isPrimary ? setGeoJsonPrimary(geoJson) : setGeoJsonComparison(geoJson),
    onFailure: setError,
    label: FETCH_DASHBOARD_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

export function fetchLayerData() {
  return apiAction({
    url: '/layer_data/',
    method: 'GET',
    onSuccess: setLayerData,
    onFailure: setError,
    label: FETCH_LAYER_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}

export function fetchEventData() {
  return apiAction({
    url: '/events/',
    onSuccess: setEventData,
    onFailure: setError,
    label: FETCH_EVENT_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}
