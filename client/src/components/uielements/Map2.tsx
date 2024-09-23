/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useRef, useEffect, useLayoutEffect, useState, useContext} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {GeoJSON, LayerGroup, LeafletMouseEvent, FeatureGroup, GeoJSONOptions, Map, layerGroup} from 'leaflet';
import MapLegend from './MapLegend';
import {Feature, GeometryObject} from 'geojson';
import chroma, {Color} from 'chroma-js';
import customTheme from '../../customTheme.json';
import {addHealthClinicMarkers} from './MapUtil';
import {makeStyles} from '@mui/styles';
import 'leaflet/dist/leaflet.css';
import * as _ from 'lodash';
import {injectIntl} from 'react-intl';
import {IndicatorConfig} from '../constTs.tsx';
import {HealthClinic, RainfallStation} from '../../common/types';
import {ComparisonMapContext} from '../provider/comparisonMapProvider';
import {changeSelectedRainfallStation, changeSelectedRainfallZone} from '../../redux/actions/filters.js';
import RainfallZoneModel from '../../model/rainfallZoneModel.js';
import {addRainfallStations} from '../../model/rainfallStationModel.js';
import CoVarsLegend from './CoVarsLegend';
import {CoVariatesLookup} from '../../const.js';

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

const IncidenceMap = ['reported_incidence',
  'predicted_incidence',
  'high_model_predictions',
  'low_model_predictions',
];

export const isIncidenceMap = (indicator:string) => {
  return IncidenceMap.includes(indicator);
};

const MapComponent = (props: any) => {
  const {mapData, geoJson, height, selectPlace, selectedMapTheme, primary, indicator} = props;
  const selectedLegend = useSelector((state:any) => state.filters.selectedLegend);
  const selectedDiffMap = useSelector((state:any) => state.filters.selectedDiffMap);
  const selectedLegendSync = useSelector((state:any) => state.filters.selectedLegendSync);
  const healthClinicData = useSelector((state:any) => state.dashboard.healthClinicData);
  const currentYear = useSelector((state:any) => state.filters.currentYear);
  const currentMonth = useSelector((state:any) => state.filters.currentMonth);
  const selectedYear = useSelector((state:any) => state.filters.selectedYear);
  const primaryIndicator = useSelector((state:any) => state.filters.selectedIndicator);
  const mapLegendMax = useSelector((state:any) => state.filters.mapLegendMax);
  const mapLegendMin = useSelector((state:any) => state.filters.mapLegendMin);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [unselectedLayer, setUnselectedLayer] = useState('');
  const {intl} = props;
  const mapLabel = IndicatorConfig[indicator] ?
    intl.formatMessage({id: IndicatorConfig[indicator].mapLabel}) : '';

  const indicatorConfig = IndicatorConfig[indicator];
  const {latLngClicked, setLatLngClicked, zoom, setZoom, center, setCenter, closePopup, setClosePopup} = useContext(ComparisonMapContext);
  const dispatch = useDispatch();
  const rainfallZoneModel = new RainfallZoneModel();

  // Data-related variables

  const minValueFromData = _.get(_.minBy(mapData, 'value'), 'value');
  const maxValueFromData = _.get(_.maxBy(mapData, 'value'), 'value');
  let maxValue = (selectedDiffMap || !selectedLegendSync) ? maxValueFromData : mapLegendMax;
  let minValue = (selectedDiffMap || !selectedLegendSync) ? minValueFromData : mapLegendMin;

  if (selectedDiffMap && !primary) {
    if (maxValue > minValue * -1) {
      minValue = maxValue * -1;
    } else {
      maxValue = minValue * -1;
    }
  }

  const numberOfSteps: number = 10;
  const isCovariateMap = () => {
    if (primary) {
      return primaryIndicator == 'neg_covars' || primaryIndicator == 'pos_covars';
    } else {
      return indicator == 'neg_covars' || indicator == 'pos_covars';
    }
  };
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
      mouseover: (e) => highlightFeature(e, null, false),
      mouseout: resetHighlight,
      click: ((e: LeafletMouseEvent) => {
        if (feature && feature.id) {
          selectPlace(feature.id);
        }
      }),
    });
  };


  const highlightFeature = (e: any, color: string = null, fromEffect: boolean) => {
    const feature = e.target;
    feature.setStyle({
      weight: 3,
      color: color ? color : '#FFCE74',
      dashArray: '',
      fillOpacity: 0.7,
    });

    if (e.latlng && !fromEffect) {
      setLatLngClicked({...e.latlng, LGA: feature.feature.properties.name});
    };

    showPopup(e, false);
  };

  const showPopup = (e: any, fromEffect: boolean) => {
    const feature = e.target;
    if (feature && feature.feature) {
      const region = _.find(mapData, {id: feature.feature.id});

      if (region) {
        const regionName = region.id.split(':').splice(2).join(':');
        let entireMsg = regionName + ' : ';
        if (isCovariateMap()) {
          const labelId = _.get(_.find(CoVariatesLookup, {'mode': region.value}), 'label');
          const coVariate = _.get(_.find(CoVariatesLookup, {'mode': region.value}), 'coVariate');
          entireMsg += intl.formatMessage({id: labelId});
          entireMsg += ' (' + intl.formatMessage({id: 'coVar_'+coVariate+'_short'}) + ')';
        } else {
          entireMsg += Number((region.value * indicatorConfig.multiper).toFixed(indicatorConfig.decimalPt)).toLocaleString() +
          ' ' + mapLabel;
        };

        window.L.popup()
            .setLatLng(e.latlng)
            .setContent(entireMsg)
            .openOn(mapObj);
      }
    }
  };

  const resetHighlight = (e: LeafletMouseEvent) => {
    geojson.resetStyle(e.target);
  };

  const themeStr = _.find(extenededlegendTheme, {color: selectedMapTheme as any});

  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme).domain([minValue, maxValue]).classes(numberOfSteps);

  /**
   * Map setup
   */
  const mapSetup = function() {
    const L = require('leaflet');
    const initialView = [14.4, -15];

    if (mapObj) {
      return;
    }

    mapObj = L.map(chart.current, {
      zoomSnap: 0.25,
      zoomDelta: 0.25,
      scrollWheelZoom: false}).setView(initialView, 6.8) as MapExtension;

    const customFeatureHandler = (feature:Feature) => {
      const region = _.find(mapData, {id: feature.id as any});
      const colors = !isCovariateMap() ? scale.colors(10) :
        _.find(customTheme, {color: selectedMapTheme as any}).values;

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
        const colors = _.get(_.find(customTheme, {color: selectedMapTheme as any}), 'values');
        const color2 = !isCovariateMap() ? scale(region.value) :
          colors[region.value-1];
        return {fillColor: color2.toString(), fillOpacity: 0.7, fill: true, color: 'grey', weight: 0.8};
      } else {
        return {color: 'lightgrey'};
      }
    };

    const rainfallFeatureHandler = (feature:Feature) => {
      return {color: 'red', fillColor: 'red', weight: 1, fillOpacity: 0};
    };

    // create map layer
    geojson = L.geoJSON(geoJson, {
      style: (feature: Feature) => {
        if (selectedLegend || (selectedDiffMap && !primary) ||
          !isIncidenceMap(indicator)) {
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

    const stationClicked = (station: RainfallStation) => {
      dispatch(changeSelectedRainfallStation(station.Station));
    };

    // for adding weather zones layer
    const weatherZoneClicked = (zone: string) => {
      dispatch(changeSelectedRainfallZone(zone));
    };

    const rainfallLayer = L.GeoJSON.geometryToLayer(
        rainfallZoneModel.getRainfallZoneGeoJson(),
    );

    rainfallZoneModel.setupLayer(rainfallLayer, currentYear, currentMonth, mapObj, weatherZoneClicked, intl.formatMessage);

    // add weather zones layer
    layerControl.addOverlay(rainfallLayer, intl.formatMessage({id: 'weather_zones'}));

    // add health clinic markers
    addHealthClinicMarkers(healthClinicData.Senegal[2020].site_data, layerControl, createSitePopup, intl.formatMessage);

    // add rainfall stations
    addRainfallStations(mapObj, layerControl, currentYear, currentMonth, intl.formatMessage, stationClicked);


    mapObj.on('overlayadd', (data)=>{
      setSelectedLayer(data.name);
      setUnselectedLayer(null);
    });
    mapObj.on('overlayremove', (data)=>{
      setUnselectedLayer(data.name);
      setSelectedLayer(null);
    });
    comparisonEventSetup(mapObj);
    setMapObj(mapObj);
  };

  const comparisonEventSetup = (mapObj: MapExtension) => {
    // setup events
    mapObj.on('zoomend', () => {
      setZoom(mapObj.getZoom());
    });
    mapObj.on('dragend', () => {
      setCenter(mapObj.getCenter());
    });
  };

  const createSitePopup = (clinic: HealthClinic, name: string) => {
    return '<div class="popupCustom">' +
    '<div class="row border"><div class="col">'+ props.intl.formatMessage({id: 'site'}) +':</div><div>' + name + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'alternate'}) +':</div><div>' + clinic.ALT + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'code'}) +':</div><div>' + clinic.CODE + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'fraction_polygenomic'}) +':</div><div>' + clinic.Fraction_polygenomic + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'fraction_unique'}) +':</div><div>' + clinic.Fraction_unique + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'heterozygosity'}) +':</div><div>' + clinic.heterozygosity + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'repeat_multiple'}) +':</div><div>' + clinic.repeated_multiple + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'repeat_twice'}) +':</div><div>' + clinic.repeated_twice + '</div></div></div>' +
    '<div class="row"><div class="col">'+ props.intl.formatMessage({id: 'type'}) +':</div><div>' + clinic.TYPE + '</div></div></div>' +
    '</div>';
  };

  /**
   * to find a map feature when a LGA is given
   * @param {*} mapObj
   * @param {*} latLng
   * @return {*} a leaflet feature
   */
  const findFeatureByLGA = (mapObj: any, latLng:any) => {
    if (!mapObj) return;
    const feature = _.find(mapObj._layers, (layer) => {
      if (layer.feature) {
        const f: any = layer.feature;
        return f.properties['name'] === latLng.LGA;
      } else {
        return false;
      }
    });
    return feature;
  };

  // update zoom for comparisom map
  useEffect(() => {
    if (mapObj && zoom > 0) {
      mapObj.setZoom(zoom);
    }
  }, [zoom]);
  // update pan for comparisom map
  useEffect(() => {
    if (mapObj && center) {
      mapObj.panTo([center.lat, center.lng]);
    }
  }, [center]);

  /**
 * for opening popup for the 2nd map on the comparison maps
 */
  useEffect(() => {
    // if (forCompare) {
    const feature = findFeatureByLGA(mapObj, latLngClicked);

    if (feature) {
      const mouseEvent : any = {
        target: feature,
        latlng: latLngClicked,
      };
      showPopup(mouseEvent, true);
    }
  }, [latLngClicked]);

  /**
   * Component Initialization
   */
  useLayoutEffect(() => {
    mapSetup();
    return (() => {
      if (mapObj) {
        mapObj.remove();
        mapObj = null;
      }
    });
  }, []);


  return (
    <div style={{position: 'relative', width: '100%', height: '100%', minHeight: height, overflow: 'hidden'}}>
      <div ref={chart} className={classes.MapContainer} id="chartContainer" />
      {/* Map Legend */}
      { !isCovariateMap() &&
        <MapLegend minValue={minValue} numberOfSteps={numberOfSteps} mapLegendMax={maxValue}
          selectedMapTheme={selectedMapTheme} legend={legend} primary={primary} selectedLayer={selectedLayer}
          unselectedLayer={unselectedLayer}
          selectedIndicator={indicator}
          key={minValue + maxValue + selectedLayer + indicator} />
      }

      { isCovariateMap() &&
        <CoVarsLegend
          selectedMapTheme="CoVars" legend={legend} primary={primary} selectedLayer={selectedLayer}
          unselectedLayer={unselectedLayer}
          selectedIndicator={indicator}
          id="covars"
          key={minValue + maxValue + selectedLayer + indicator} />
      }


      {/* Difference note */}
      {!primary && selectedDiffMap &&
        <div className={classes.note_diff}>
          {intl.formatMessage({id: 'difference_calculate_by'}) + ' : ' +
           indicator + ' ' +
          intl.formatMessage({id: 'in'}) + ' ' +
          selectedYear + ' - ' + primaryIndicator + ' ' +
          intl.formatMessage({id: 'in'}) + ' ' +
          currentYear}
        </div>
      }
    </div>
  );
};

export default injectIntl(MapComponent);

