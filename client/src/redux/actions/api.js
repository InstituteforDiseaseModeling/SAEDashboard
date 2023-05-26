import {API, API_DENIED, API_END, API_ERROR, API_START} from './types';

/**
 * payload for calling an API
 * @return {*} api action message
 */
export function apiAction({url = '', method = 'GET', data = null,
  onSuccess = null, onFailure = null, label = '', headers=null}) {
  return {
    type: API,
    payload: {
      url,
      method,
      data,
      headers,
      onSuccess,
      onFailure,
      label,
    },
  };
}

/**
 * message for API_START
 * @param {string} label
 * @return {*} api start message
 */
export function apiStart(label) {
  return {
    type: API_START,
    payload: label,
  };
}

/**
 * message for API_END
 * @param {string} label
 * @return {*} api end message
 */
export function apiEnd(label) {
  return {
    type: API_END,
    payload: label,
  };
}

/**
 * message for access denied
 * @param {string} url
 * @return {*} access denied message
 */
export function accessDenied(url) {
  return {
    type: API_DENIED,
    payload: {
      url,
    },
  };
}

/**
 * message for api error
 * @param {*} error
 * @param {*} label
 * @return {*} api error message
 */
export function apiError(error, label=null) {
  return {
    type: API_ERROR,
    error,
    payload: label,
  };
}
