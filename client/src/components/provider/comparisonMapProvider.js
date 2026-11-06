import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
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

  // A saved view belongs to one country; drop it on country switch so the
  // maps re-fit to the new country's data instead of restoring the old view.
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  useEffect(() => {
    setZoom(undefined);
    setCenter(undefined);
  }, [selectedCountry]);

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
