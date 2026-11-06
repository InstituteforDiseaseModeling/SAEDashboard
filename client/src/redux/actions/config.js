import {
  FETCH_CONFIG_DATA, SET_CONFIG_DATA, UPDATE_INDICATOR_CONFIG, SHOW_ERROR,
} from './types';
import {apiAction} from './api';

export function setConfigData(configData) {
  return {
    type: SET_CONFIG_DATA,
    configData,
  };
}

export function updateIndicatorConfig(indicator, meta) {
  return {
    type: UPDATE_INDICATOR_CONFIG,
    indicator,
    meta,
  };
}

function setConfigError(data) {
  const response = data.response;
  return {
    type: SHOW_ERROR,
    variant: 'error',
    msg: (response && response.statusText) ? response.statusText : 'Error loading config.',
    open: true,
  };
}

export function fetchConfigData() {
  return apiAction({
    url: '/config',
    onSuccess: setConfigData,
    onFailure: setConfigError,
    label: FETCH_CONFIG_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}
