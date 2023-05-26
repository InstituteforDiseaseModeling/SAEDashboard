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

// import {MapContainer, TileLayer} from "react-leaflet";
// import {LatLngExpression} from "leaflet";
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
      const regionName = region.id.split(':').splice(2).join(':');
      const latlng = Array.isArray(feature._latlngs[0][0]) ?
        feature._latlngs[0][0][0] : feature._latlngs[0][0];
      window.L.popup()
          .setLatLng(e.latlng)
          .setContent(regionName + ' : ' + (region.value).toFixed(2) + ' cases/1000')
          .openOn(mapObj);
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

