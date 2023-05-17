import {
  SET_GEOJSON_DATA,
} from '../actions/types';


const initialState = {
  geoJson: null,
};

/**
 * reducer for dashboard actions
 * @param {*} state
 * @param {*} action
 * @return {*} new dashboard state
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_GEOJSON_DATA:

      return {...state, geoJson: action.geoJson};

    default:
      return state;
  }
}
