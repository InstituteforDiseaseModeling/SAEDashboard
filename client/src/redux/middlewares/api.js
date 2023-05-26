import axios from 'axios';
import {API} from '../actions/types';
import {accessDenied, apiError, apiStart, apiEnd} from '../actions/api';

/**
 * redux middleware for calling api
 * @param {*} dispatch
 * @return {*} NA
 */
const apiMiddleware = ({dispatch}) => (next) => (action) => {
  next(action);

  if (action.type !== API) return;

  const {
    url,
    method,
    data,
    accessToken,
    onSuccess,
    onFailure,
    label,
    headers,
  } = action.payload;

  const dataOrParams = ['GET', 'DELETE'].includes(method) ? 'params' : 'data';

  // axios default configs
  axios.defaults.baseURL = process.env.API_BASE_URL || '/api';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Authorization'] = `Bearer${accessToken}`;

  if (label) {
    dispatch(apiStart(label));
  }


  axios.request({
    url,
    method,
    headers,
    [dataOrParams]: data,
  })
      .then((obj) => {
        if (onSuccess) dispatch(onSuccess(obj.data));
      })
      .catch((error) => {
        dispatch(apiError(error, label));
        if (onFailure) dispatch(onFailure(error));

        if (error.response && error.response.status === 403) {
          dispatch(accessDenied(window.location.pathname));
        }
      })
      .finally(() => {
        if (label) {
          dispatch(apiEnd(label));
        }
      });
};

export default apiMiddleware;
