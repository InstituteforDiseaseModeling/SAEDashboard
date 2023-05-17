/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useRef, useEffect, useState} from 'react';
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

const extenededlegendTheme: CustomTheme[] = customTheme;

const MapComponent = (props: any) => {
  const {mapData, geoJson, height, selectPlace, selectedMapTheme, mapLegendMax} = props;

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
        selectPlace(feature.id);
      }),
    });
  };


  const highlightFeature = (e: LeafletMouseEvent, color: string = null) => {
    const feature = e.target;
    feature.setStyle({
      weight: 1,
      color: color ? color : '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });

    const region = _.find(mapData, {id: feature.feature.id});
    const regionName = region.id.split(':').splice(2).join(':');
    const latlng = Array.isArray(feature._latlngs[0][0]) ?
      feature._latlngs[0][0][0] : feature._latlngs[0][0];
    window.L.popup()
        .setLatLng(latlng)
        .setContent(regionName + ' : ' + (region.value * 100).toFixed(2) + '%')
        .openOn(mapObj);
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

    const accessToken = 'pk.eyJ1IjoiaWRtLW1hcGJveCIsImEiOiJjajF3ZmxmYjIwMDBnMnhwaDM1bGthMHIyIn0.SY_9QXFsEGZYN0CmFBU_rQ';

    const initialView = [14.716677, -17.467686];

    mapObj = L.map(chart.current).setView(initialView, 6.3) as MapExtension;

    // ... our listeners
    geojson = L.geoJSON(geoJson, {
      style: (feature: Feature) => {
        const region = _.find(mapData, {id: feature.id});
        if (region && region.value) {
          const color2 = scale(region.value);
          return {color: color2.toString(), fillOpacity: 0.7, fill: true};
        } else {
          return {color: 'transparent'};
        }
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

