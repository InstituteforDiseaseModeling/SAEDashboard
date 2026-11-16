import {
  SET_GEOJSON_DATA_PRIMARY,
  SET_GEOJSON_DATA_COMPARISON,
  SET_LAYER_DATA, SET_EVENT_DATA,
} from '../actions/types';


const initialState = {
  geoJson: null,
  layerData: null,
  eventData: null,
};

/**
 * reducer for dashboard actions
 * @param {*} state
 * @param {*} action
 * @return {*} new dashboard state
 */
export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GEOJSON_DATA_PRIMARY:
      return {...state, geoJsonPrimary: action.geoJson};
    case SET_GEOJSON_DATA_COMPARISON:
      return {...state, geoJsonComparison: action.geoJson};
    case SET_LAYER_DATA:
      return {...state, layerData: action.layerData};
    case SET_EVENT_DATA:
      return {...state, eventData: action.eventData};
    default:
      return state;
  }
}
