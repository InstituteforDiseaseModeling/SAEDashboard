import {API_END, API_ERROR, API_START, FETCH_DASHBOARD_DATA} from '../actions/types';

const initialState = {
  isLoadingData: false,
  error: null,
};


/**
 * reducer for api actions
 * @param {*} state
 * @param {*} action
 * @return {*} new api state
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case API_START:
      if (action.payload === FETCH_DASHBOARD_DATA) {
        return {...state, isLoadingData: true};
      }
      return state;

    case API_ERROR:
      if (action.payload === FETCH_DASHBOARD_DATA) {
        return {...state, error: action.error};
      }
      return state;

    case API_END:
      if (action.payload === FETCH_DASHBOARD_DATA) {
        return {...state, isLoadingData: false};
      }
      return state;

    default:
      return state;
  }
}
