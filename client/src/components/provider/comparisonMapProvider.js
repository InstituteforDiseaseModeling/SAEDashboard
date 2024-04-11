import React, {useState} from 'react';
import PropTypes from 'prop-types';

const initialSettings = {
  latLngClicked: {lat: 0, lng: 0, LGA: ''},
  setLatLngClicked: (param) => {},
  zoom: 0,
  setZoom: (param) => {},
  center: {lat: 0, lng: 0},
  setCenter: (param) => {},
  closePopup: false,
  setClosePopup: () => {},
};


/* comparison settings context creation */
export const ComparisonMapContext = React.createContext(initialSettings);

/**
 * for storing context needed to synchronize user actions on the comparison maps
 * @param {*} props
 * @return {*} provider component
 */
function ComparisonMapProvider(props) {
  // for showing popup at specific latlng
  const [latLngClicked, setLatLngClickedInternal] = useState(initialSettings.latLngClicked);
  // for setting zoom
  const [zoom, setZoom] = useState();
  // for setting center
  const [center, setCenter] = useState();
  // for closing popup
  const [closePopup, setClosePopup] = useState(false);

  const setLatLngClicked = (latLng) => {
    setLatLngClickedInternal({...latLng});
  };

  const context={
    latLngClicked,
    setLatLngClicked,
    zoom,
    setZoom,
    center,
    setCenter,
    closePopup,
    setClosePopup,
  };

  return (
    <ComparisonMapContext.Provider value={context}>
      {props.children}
    </ComparisonMapContext.Provider>
  );
}


ComparisonMapProvider.propTypes = {
  children: PropTypes.any,
};

export default ComparisonMapProvider;
