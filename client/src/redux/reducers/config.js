import {SET_CONFIG_DATA, UPDATE_INDICATOR_CONFIG} from '../actions/types';

const initialState = {
  app: null,
  indicators: null,
  loaded: false,
};

/**
 * Reducer for app and indicator configuration.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} Next state.
 */
export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONFIG_DATA:
      return {
        app: action.configData?.app || {},
        indicators: action.configData?.indicators || {},
        loaded: true,
      };
    case UPDATE_INDICATOR_CONFIG:
      return {
        ...state,
        indicators: {
          ...state.indicators,
          [action.indicator]: action.meta,
        },
      };
    default:
      return state;
  }
}
