import {
  SET_GEOJSON_DATA_PRIMARY,
  SET_GEOJSON_DATA_COMPARISON,
  SET_HEALTH_CLINIC_DATA, SET_EVENT_DATA,
} from '../actions/types';


const initialState = {
  geoJson: null,
  healthClinicData: null,
  eventData: null,
};

/**
 * reducer for dashboard actions
 * @param {*} state
 * @param {*} action
 * @return {*} new dashboard state
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_GEOJSON_DATA_PRIMARY:
      return {...state, geoJsonPrimary: action.geoJson};
    case SET_GEOJSON_DATA_COMPARISON:
      return {...state, geoJsonComparison: action.geoJson};
    case SET_HEALTH_CLINIC_DATA:
      return {...state, healthClinicData: action.healthClinicData};
    case SET_EVENT_DATA:
      return {...state, eventData: action.eventData};
    default:
      return state;
  }
}
