import {
  FETCH_CONFIG_DATA, SET_CONFIG_DATA, UPDATE_INDICATOR_CONFIG, SHOW_ERROR,
} from './types';
import {apiAction} from './api';

/**
 * Store the app and indicator configuration.
 * @param {Object} configData
 * @return {Object} Redux action.
 */
export function setConfigData(configData) {
  return {
    type: SET_CONFIG_DATA,
    configData,
  };
}

/**
 * Update the configuration of one indicator.
 * @param {string} indicator
 * @param {Object} meta
 * @return {Object} Redux action.
 */
export function updateIndicatorConfig(indicator, meta) {
  return {
    type: UPDATE_INDICATOR_CONFIG,
    indicator,
    meta,
  };
}

/**
 * Build an error notification for a failed config request.
 * @param {Object} data
 * @return {Object} Redux action.
 */
function setConfigError(data) {
  const response = data.response;
  return {
    type: SHOW_ERROR,
    variant: 'error',
    msg: (response && response.statusText) ? response.statusText : 'Error loading config.',
    open: true,
  };
}

/**
 * Fetch the app and indicator configuration.
 * @return {Object} API middleware action.
 */
export function fetchConfigData() {
  return apiAction({
    url: '/config',
    onSuccess: setConfigData,
    onFailure: setConfigError,
    label: FETCH_CONFIG_DATA,
    headers: {'Access-Control-Allow-Origin': '*'},
  });
}
