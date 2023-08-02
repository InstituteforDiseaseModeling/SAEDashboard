import {
  SET_GEOJSON_DATA, SET_HEALTH_CLINIC_DATA,
} from '../actions/types';


const initialState = {
  geoJson: null,
  healthClinicData: null,
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
    case SET_HEALTH_CLINIC_DATA:
      return {...state, healthClinicData: action.healthClinicData};

    default:
      return state;
  }
}
