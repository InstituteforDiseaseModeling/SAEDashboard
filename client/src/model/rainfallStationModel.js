/* eslint-disable max-len */
import RainfallStations from '../data/rainfall_stations.json';
import RainfallData from '../data/rainfall_2018_2023.json';
import * as _ from 'lodash';
import chroma from 'chroma-js';

const RAINFALL_FIELD = 'Rainfall_mm';
/**
 * @param {*} station
 * @param {*} yr
 * @param {*} month
 * @return {*} rainfall data by zone, year and month
 */
const getRainfallByStationYrMonth = (station, yr, month) => {
  const rainfallData = RainfallData;

  let totalRainfall = 0;

  if (month == 0 || !month) {
    // aggregate data for the year
    const data = _.filter(rainfallData, {'Admin': station, 'Year': yr});
    totalRainfall = data.reduce((acc, val) =>
      acc += val[RAINFALL_FIELD]
    , 0);
  } else {
    const monthData = _.filter(rainfallData,
        {'Admin': station, 'Year': yr, 'Month': month-1});
    totalRainfall = monthData[0] ? monthData[0][RAINFALL_FIELD] : 0;
  }
  return totalRainfall;
};

/**
 * To get rainfall ranch by year and month
 * @param {*} yr
 * @param {*} month
 * @return {*} rainfall range for a year and month
 */
const getRainfallRangeYrMonth = (yr, month) => {
  const _rainfallData = RainfallData;
  let data = null;
  if (month) {
    data = _.filter(_rainfallData, {'Year': yr, 'Month': month});
  } else {
    data = _.filter(_rainfallData, {'Year': yr});
  }
  const max = _.maxBy(data, RAINFALL_FIELD);
  const min = _.minBy(data, RAINFALL_FIELD);
  return [min[RAINFALL_FIELD], max[RAINFALL_FIELD]];
};

/**
 * To add rainfall station markers
 * @param {*} mapObj
 * @param {*} layerControl
 * @param {*} yr
 * @param {*} month
 * @param {*} formatMessage
 * @param {*} clickHandler
 */
export function addRainfallStations(mapObj, layerControl, yr, month, formatMessage, clickHandler) {
  const L = require('leaflet');
  const stationMarkers = [];
  const rainfallStations = RainfallStations;

  const range = getRainfallRangeYrMonth(yr, month);

  const greens = chroma.scale('Greens').domain(range).classes(4);

  for (const station in rainfallStations) {
    if (station) {
      const _station = rainfallStations[station];
      const stationRainfall = getRainfallByStationYrMonth(_station.Station, yr, month);
      const color = greens(stationRainfall);
      const marker = L.marker([parseFloat(_station.Lat_y), parseFloat(_station.Long_x)],
          {icon: rainMarker(color)});
      // .bindPopup(_station.Station + ' ' + 'station', {'className': 'popupCustom'});/
      marker.on('click', function() {
        clickHandler(_station);
      });
      marker.on('mouseover', function(e) {
        window.L.popup()
            .setContent(_station.Station + ' : ' + Math.round(stationRainfall * 100) / 100 + ' mm')
            .setLatLng(e.latlng)
            .openOn(mapObj);
      });
      marker.on('mouseout', function() {
        mapObj.closePopup();
      });
      stationMarkers.push(marker);
    }
  };

  const lg = L.layerGroup(stationMarkers);
  layerControl.addOverlay(lg, formatMessage({id: 'weather_stations'}));
};

/**
 * for rain marker
 * @param {*} color
 * @return {*} - icon
 */
export function rainMarker(color) {
  const _color = color ? color : '#3392d0';

  return window.L.divIcon({
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"
    fill=${_color} ><rect fill="none" height="24" width="24"/>
    <path stroke="grey" d="M5,18c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1S5,17.45,5,18z M17,18c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1 S17,17.45,17,18z M8,22c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1S8,21.45,8,22z M11,18c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1 S11,17.45,11,18z M14,22c0,0.55,0.45,1,1,1s1-0.45,1-1s-0.45-1-1-1S14,21.45,14,22z M17.5,16h-10C4.47,16,2,13.53,2,10.5 c0-2.76,2.09-5.09,4.78-5.44C7.83,3.18,9.82,2,12,2c2.97,0,5.45,2.18,5.92,5.02C20.21,7.23,22,9.16,22,11.5 C22,13.98,19.98,16,17.5,16z"/></svg>
    `,
    className: 'marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};
