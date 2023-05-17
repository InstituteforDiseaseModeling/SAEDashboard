import {SHOW_WARNING, SHOW_INFO, SHOW_ERROR, SHOW_STOP, SHOW_SUCCESS} from './types';
import {isJson} from '../../utils/utils';


/**
 * for setting the action object to show an error
 * @param {*} data
 * @return {*}  show error message
 */
export function showError(data) {
  const genericError = 'This website is unavailable at the moment. Please try again later.';
  let msg;

  if (!isJson(data)) {
    msg = data;
  } else {
    const jsonData = JSON.parse(data);
    if (jsonData && jsonData.message) {
      if (jsonData.message === 'Unexpected token E in JSON at position 0') {
        msg = genericError;
      } else {
        msg = jsonData.message;
      }
    } else if (jsonData.messages) {
      msg = JSON.stringify(jsonData.messages);
    }
  }

  return {
    type: SHOW_ERROR,
    variant: 'error',
    msg,
    open: true,
  };
}

/**
 * for setting showInfo action message
 * @param {*} msg
 * @return {*} showInfo message
 */
export function showInfo(msg) {
  return {
    type: SHOW_INFO,
    variant: 'info',
    msg,
    open: true,
  };
}

/** for setting show warning message
 * @param {*} msg
 * @return {*} show warning message
*/
export function showWarning(msg) {
  return {
    type: SHOW_WARNING,
    variant: 'warning',
    msg,
    open: true,
  };
}

/** for setting show stop message
 * @return {*} show stop message
*/
export function showStop() {
  return {
    type: SHOW_STOP,
    variant: '',
    open: false,
  };
}

/** for setting show success message
 * @param {*} msg
 * @return {*} show success message
*/
export function showSuccess(msg) {
  return {
    type: SHOW_SUCCESS,
    msg,
    variant: 'success',
    open: true,
  };
}
