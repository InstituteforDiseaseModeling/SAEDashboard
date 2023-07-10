/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useRef, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {GeoJSON, LayerGroup, LeafletMouseEvent, FeatureGroup, GeoJSONOptions, Map} from 'leaflet';
import MapLegend from './MapLegend';
import {Feature, GeometryObject} from 'geojson';
import chroma from 'chroma-js';
import customTheme from '../../customTheme.json';
import ClinicSites from '../../data/ClinicSites.json';


import {makeStyles} from '@mui/styles';
import 'leaflet/dist/leaflet.css';
import * as _ from 'lodash';

const styles = makeStyles({
  MapContainer: {
    backgroundColor: 'white',
    height: '100%',
  },
});

/**
 * Interfaces
 */
interface MapExtension extends Map {
  _layers: FeatureGroup[]
}

interface CustomTheme {
  color: string,
  values: string[]
}

// interface StateFilter

const extenededlegendTheme: CustomTheme[] = customTheme;

const MapComponent = (props: any) => {
  const {mapData, geoJson, height, selectPlace, selectedMapTheme, mapLegendMax} = props;
  const selectedLegend = useSelector((state:any) => state.filters.selectedLegend);

  // Data-related variables
  const minValue: number = 0;
  const numberOfSteps: number = 10;
  const legend = useRef(null);

  interface FeatureAddOn extends GeoJSONOptions {
    name: string,
    NAME: string,
    clicked: boolean,
    iso_a3: string,
  };

  const classes = styles();
  const chart = useRef() as React.MutableRefObject<HTMLDivElement>;
  let [mapObj, setMapObj] = useState<MapExtension>();
  let geojson: GeoJSON;

  /**
   * for setting up a feature (place ) on the map
   * @param {*} feature
   * @param {*} layer
   */
  const onEachFeature = function(feature: Feature<GeometryObject, FeatureAddOn>, layer: LayerGroup) {
    const layerFeature = layer.feature as Feature<GeometryObject, FeatureAddOn>;

    const placeName = feature.properties.name || feature.properties.NAME;

    layerFeature.properties['name'] = placeName;

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: ((e: LeafletMouseEvent) => {
        if (feature && feature.id) {
          selectPlace(feature.id);
        }
      }),
    });
  };


  const highlightFeature = (e: LeafletMouseEvent, color: string = null) => {
    const feature = e.target;
    feature.setStyle({
      weight: 3,
      color: color ? color : 'yellow',
      dashArray: '',
      fillOpacity: 0.7,
    });

    if (feature && feature.feature) {
      const region = _.find(mapData, {id: feature.feature.id});
      if (region) {
        const regionName = region.id.split(':').splice(2).join(':');
        const latlng = Array.isArray(feature._latlngs[0][0]) ?
          feature._latlngs[0][0][0] : feature._latlngs[0][0];
        window.L.popup()
            .setLatLng(e.latlng)
            .setContent(regionName + ' : ' + (region.value).toFixed(2) + ' cases/1000')
            .openOn(mapObj);
      }
    }
  };

  const resetHighlight = (e: LeafletMouseEvent) => {
    geojson.resetStyle(e.target);
  };

  const themeStr = _.find(extenededlegendTheme, {color: selectedMapTheme} as any);

  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme).domain([minValue, mapLegendMax]).classes(numberOfSteps);

  /**
   * Map setup
   */
  const mapSetup = function() {
    const L = require('leaflet');

    // const accessToken = 'pk.eyJ1IjoiaWRtLW1hcGJveCIsImEiOiJjajF3ZmxmYjIwMDBnMnhwaDM1bGthMHIyIn0.SY_9QXFsEGZYN0CmFBU_rQ';

    const initialView = [14.4, -15];

    mapObj = L.map(chart.current).setView(initialView, 6.8) as MapExtension;


    const customFeatureHandler = (feature:Feature) => {
      const region = _.find(mapData, {id: feature.id});
      const colors = scale.colors(10);
      let color = '#CCCCCC';
      if (region && region.value) {
        if (region.value <= 5) {
          color = '#16af39'; // colors[0];
        } else if (region.value <= 15) {
          color = '#f4ca18'; // colors[4];
        } else if (region.value > 15) {
          color = '#c81325'; // colors[9];
        } else {
          color = '#CCCCCC';
        };

        return {fillColor: color.toString(), fillOpacity: 0.7, fill: true, color: 'grey', weight: 0.8};
      } else {
        return {color: 'transparent'};
      }
    };

    const standardFeatureHandler = (feature:Feature) => {
      const region = _.find(mapData, {id: feature.id});
      if (region && region.value) {
        const color2 = scale(region.value);
        return {fillColor: color2.toString(), fillOpacity: 0.7, fill: true, color: 'grey', weight: 0.8};
      } else {
        return {color: 'transparent'};
      }
    };


    // ... our listeners
    geojson = L.geoJSON(geoJson, {
      style: (feature: Feature) => {
        if (selectedLegend) {
          return standardFeatureHandler(feature);
        } else {
          return customFeatureHandler(feature);
        };
      },
      onEachFeature: onEachFeature,
    });

    geojson.addTo(mapObj);
    const layerControl = L.control.layers().addTo(mapObj);

    const icon = L.icon({
      iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
      iconSize: [24, 36],
      iconAnchor: [12, 36],
    });

    const sites:any[] = [];

    ClinicSites.forEach((clinic) => {
      const marker = L.marker([clinic.Lat_2, clinic.Long_2], {icon: icon}).bindPopup(createSitePopup(clinic), {'className': 'popupCustom'});
      sites.push(marker);
    });

    const parks = L.layerGroup(sites);
    layerControl.addOverlay(parks, 'Health facilities');
  };

  const createSitePopup = (clinic: any) => {
    return '<div class="popupCustom">' +
    '<div class="row border"><div class="col">site:</div><div>' + clinic.SITE + '</div></div></div>' +
    '<div class="row"><div class="col">alt:</div><div>' + clinic.ALT + '</div></div></div>' +
    '<div class="row"><div class="col">code:</div><div>' + clinic.CODE + '</div></div></div>' +
    '<div class="row"><div class="col">f. polygenomic:</div><div>' + clinic.Fraction_polygenomic + '</div></div></div>' +
    '<div class="row"><div class="col">f. unique:</div><div>' + clinic.Fraction_unique + '</div></div></div>' +
    '<div class="row"><div class="col">heterozygosity:</div><div>' + clinic.heterozygosity + '</div></div></div>' +
    '<div class="row"><div class="col">repeat multiple:</div><div>' + clinic.repeated_multiple + '</div></div></div>' +
    '<div class="row"><div class="col">repeat twice:</div><div>' + clinic.repeated_twice + '</div></div></div>' +
    '<div class="row"><div class="col">type:</div><div>' + clinic.TYPE + '</div></div></div>' +
    '</div>';
  };

  /**
   * Component Initialization
   */
  useEffect(() => {
    mapSetup();
    return (() => {
    });
  }, []);

  return (
    <div style={{position: 'relative', width: '100%', height: '100%', minHeight: height, overflow: 'hidden'}}>
      <div ref={chart} className={classes.MapContainer} id="chartContainer" />
      <MapLegend minValue={minValue} numberOfSteps={numberOfSteps} mapLegendMax={mapLegendMax}
        selectedMapTheme={selectedMapTheme} legend={legend} />
    </div>
  );
};

export default MapComponent;

