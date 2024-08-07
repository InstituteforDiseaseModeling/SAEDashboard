/* eslint-disable no-unused-vars */

import rainfallZoneData from '../data/SEN_Climate_4Regions_2018_2023.json';
import rainfallZonesGeoJson from '../data/SEN_4RainZonesGeoJson.json';
import * as _ from 'lodash';
import chroma from 'chroma-js';

/* a work around to locate zones base on latlng data on the geoJson */
export const zones = {
  '3': 'Nord et ouest', // north
  '6': 'Centre', // center
  '2776': 'Sud et sud-est', // south east
  '837': 'Sud-ouest', // south west
};


/**
 * RainfallZoneModel class
 */
export class RainfallZoneModel {
  /**
   * constructor
   */
  constructor() {
  }
  /**
   * getRainfallZone geoJson
   * @return {*} rainfallZone geoJson
   */
  getRainfallZoneGeoJson = () => {
    return rainfallZonesGeoJson;
  };

  /**
   * @param {*} zone
   * @param {*} yr
   * @param {*} month
   * @return {*} rainfall data by zone, year and month
   */
  getRainfallByZoneYrMonth = (zone, yr, month) => {
    const _rainfallZoneData = rainfallZoneData;
    return _.filter(_rainfallZoneData, {'Zone': zone, 'Year': yr,
      'Month': month == 0 || !month ? 'Total' : month.toString()});
  };

  /**
   * To get rainfall ranch by year and month
   * @param {*} yr
   * @param {*} month
   * @return {*} rainfall range for a year and month
   */
  getRainfallRangeYrMonth = (yr, month) => {
    const _rainfallZoneData = rainfallZoneData;
    const values = _.filter(_rainfallZoneData, {'Year': yr,
      'Month': month == 0 || !month ? 'Total' : month.toString()});
    const max = _.maxBy(values, 'Average_rain_mm');
    const min = _.minBy(values, 'Average_rain_mm');
    return [min['Average_rain_mm'], max['Average_rain_mm']];
  };

  /**
   * for each layer in the rainfallLayer, set the style and name
   * @param {*} rainfallLayer
   * @param {*} yr
   * @param {*} month
   * @param {*} mapObj
   * @param {*} clickHandler
   */
  setupLayer = (rainfallLayer, yr, month, mapObj, clickHandler) => {
    for (const layerId in rainfallLayer._layers) {
      if (Object.hasOwn(rainfallLayer._layers, layerId)) {
        let nameIndex = '';
        if (rainfallLayer._layers[layerId]._latlngs.length == 1) {
          nameIndex = rainfallLayer._layers[layerId]._latlngs[0].length.toString();
        } else {
          nameIndex = rainfallLayer._layers[layerId]._latlngs.length.toString();
        }
        const range = this.getRainfallRangeYrMonth(yr, month);
        const zone = this.getRainfallByZoneYrMonth(zones[nameIndex], yr, month);

        console.log('calculate scale again........');
        // To get a continuous color scheme, remove the .classes()
        const greens = chroma.scale('Greens').domain(range).classes(4);

        rainfallLayer._layers[layerId].setStyle({
          fillOpacity: 0.8,
          fillColor: zone[0] ? greens(zone[0]['Average_rain_mm']) : 'red',
          color: '#32a852',
          weight: 2,
          name: (zones)[nameIndex],
          data: zone[0],
        });
        rainfallLayer._layers[layerId]['name'] = (zones)[nameIndex];
        rainfallLayer._layers[layerId]['data'] = zone[0];
        rainfallLayer._layers[layerId].on('click', (e) => {
          clickHandler(rainfallLayer._layers[layerId]['name']);
        });
        rainfallLayer._layers[layerId].on('mouseover', (e) => {
          const msg = rainfallLayer._layers[layerId]['name'] + ' : ' +
            (rainfallLayer._layers[layerId]['data'] ?
            Math.round(rainfallLayer._layers[layerId]['data']['Average_rain_mm'] * 100) / 100 +
            ' mm' : 'No data');

          window.L.popup()
              .setContent(msg)
              .setLatLng(e.latlng)
              .openOn(mapObj);
        });
        rainfallLayer._layers[layerId].on('mouseout', (e) => {
          mapObj.closePopup();
        });
      }
    };
  };
}

export default RainfallZoneModel;

