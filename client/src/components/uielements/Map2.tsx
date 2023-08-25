/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useRef, useEffect, useState, ObjectHTMLAttributes} from 'react';
import {useSelector} from 'react-redux';
import {GeoJSON, LayerGroup, LeafletMouseEvent, FeatureGroup, GeoJSONOptions, Map} from 'leaflet';
import MapLegend from './MapLegend';
import {Feature, GeometryObject} from 'geojson';
import chroma, {Color} from 'chroma-js';
import customTheme from '../../customTheme.json';
import {colorMarker} from './MapUtil';

import {makeStyles} from '@mui/styles';
import 'leaflet/dist/leaflet.css';
import * as _ from 'lodash';

import {HealthClinic, MapData} from '../../common/types';

const styles = makeStyles({
  MapContainer: {
    backgroundColor: 'white',
    height: '100%',
  },
  note_diff: {
    top: -20,
    color: 'darkred',
    position: 'inherit',
    fontSize: '0.8rem',
    backgroundColor: 'yellow',
    padding: '0 5px',
    width: 'fit-content',
    left: 13,
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

interface MapPros {
  mapData: MapData[],
  geoJson: object,
  height: number,
  selectPlace: (id:string | number)=>void,
  selectedMapTheme: any,
  primary: string,
  indicator: string,
}

const MapComponent = (props: MapPros) => {
  const {mapData, geoJson, height, selectPlace, selectedMapTheme, primary, indicator} = props;
  const selectedLegend = useSelector((state:any) => state.filters.selectedLegend);
  const selectedDiffMap = useSelector((state:any) => state.filters.selectedDiffMap);
  const healthClinicData = useSelector((state:any) => state.dashboard.healthClinicData);
  const currentYear = useSelector((state:any) => state.filters.currentYear);
  const selectedYearMonth = useSelector((state:any) => state.filters.selectedYearMonth);
  const selectedIndicator = useSelector((state:any) => state.filters.selectedIndicator);
  const mapLegendMax = useSelector((state:any) => state.filters.mapLegendMax);
  const mapLegendMin = useSelector((state:any) => state.filters.mapLegendMin);

  // Data-related variables

  const minValueFromData = _.get(_.minBy(mapData, 'value'), 'value');
  const maxValueFromData = _.get(_.maxBy(mapData, 'value'), 'value');
  let maxValue = selectedDiffMap ? maxValueFromData : mapLegendMax;
  let minValue = selectedDiffMap ? minValueFromData : mapLegendMin;

  if (selectedDiffMap && !primary) {
    if (maxValue > minValue * -1) {
      minValue = maxValue * -1;
    } else {
      maxValue = minValue * -1;
    }
  }


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
      color: color ? color : '#FFCE74',
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

  const themeStr = _.find(extenededlegendTheme, {color: selectedMapTheme as any});

  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme).domain([minValue, maxValue]).classes(numberOfSteps);

  const blues = chroma.scale('Blues').domain([0, 1]).classes(5); // used for health clinic markers

  /**
   * Map setup
   */
  const mapSetup = function() {
    const L = require('leaflet');

    const initialView = [14.4, -15];
    const blueColors = blues.colors(5);

    mapObj = L.map(chart.current).setView(initialView, 6.8) as MapExtension;

    const customFeatureHandler = (feature:Feature) => {
      const region = _.find(mapData, {id: feature.id as any});
      const colors = scale.colors(10);

      let color = '#CCCCCC';
      if (region && region.value) {
        if (region.value <= 5) {
          color = '#1d9660'; // colors[0];
        } else if (region.value <= 50) {
          color = '#1bd357'; // colors[4];
        } else if (region.value <= 100) {
          color = '#9efe66'; // colors[9];
        } else if (region.value <= 250) {
          color = '#fdff01'; // colors[9];
        } else if (region.value <= 450) {
          color = '#fca725'; // colors[9];
        } else if (region.value <= 650) {
          color = '#fb0000'; // colors[9];
        } else {
          color = '#850428';
        };

        return {fillColor: color.toString(), fillOpacity: 0.7, fill: true, color: 'grey', weight: 0.8};
      } else {
        return {color: 'lightgrey'};
      }
    };

    const standardFeatureHandler = (feature:Feature) => {
      const region = _.find(mapData, {id: feature.id as any});
      if (region && region.value) {
        const color2 = scale(region.value);
        return {fillColor: color2.toString(), fillOpacity: 0.7, fill: true, color: 'grey', weight: 0.8};
      } else {
        return {color: 'lightgrey'};
      }
    };


    // ... our listeners
    geojson = L.geoJSON(geoJson, {
      style: (feature: Feature) => {
        if (selectedLegend || (selectedDiffMap && !primary)) {
          // if it is a difference map, use the standard feature handler
          return standardFeatureHandler(feature);
        } else {
          return customFeatureHandler(feature);
        };
      },
      onEachFeature: onEachFeature,
    });

    geojson.addTo(mapObj);
    const layerControl = L.control.layers().addTo(mapObj);
    const sites:HealthClinic[] = [];

    for (const site in healthClinicData.Senegal[2020].site_data) {
      if (site) {
        const clinic = healthClinicData.Senegal[2020].site_data[site];
        let colorIndex = Math.ceil(clinic.Fraction_polygenomic * 5) - 1;
        if (!clinic.Fraction_polygenomic) {
          colorIndex = -1;
        }
        const marker = L.marker([clinic.Lat_2, clinic.Long_2],
            {icon: colorMarker(colorIndex == -1 ? 'crimson' : blueColors[colorIndex])}).bindPopup(createSitePopup(clinic, site), {'className': 'popupCustom'});
        sites.push(marker);
      }
    };

    const parks = L.layerGroup(sites);
    layerControl.addOverlay(parks, 'Health facilities');
  };

  const createSitePopup = (clinic: HealthClinic, name: string) => {
    return '<div class="popupCustom">' +
    '<div class="row border"><div class="col">site:</div><div>' + name + '</div></div></div>' +
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
      <MapLegend minValue={minValue} numberOfSteps={numberOfSteps} mapLegendMax={maxValue}
        selectedMapTheme={selectedMapTheme} legend={legend} primary={primary}
        key={minValue + maxValue}/>

      {/* Difference note */}
      {!primary && selectedDiffMap &&
        <div className={classes.note_diff}>
          Difference is calculated by : {indicator} cases in { selectedYearMonth } - {selectedIndicator} cases in { currentYear}
        </div>
      }
    </div>
  );
};

export default MapComponent;

