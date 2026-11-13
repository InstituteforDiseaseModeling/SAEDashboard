/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {useRef, useEffect, useLayoutEffect, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import {GeoJSON, LayerGroup, LeafletMouseEvent, FeatureGroup, GeoJSONOptions, Map} from 'leaflet';
import MapLegend from './Legends/MapLegend.js';
import {Feature, GeometryObject} from 'geojson';
import chroma from 'chroma-js';
import customTheme from '../../customTheme.json';
import {extraInfo} from './MapUtil';
import {makeStyles} from '@mui/styles';
import 'leaflet/dist/leaflet.css';
import * as _ from 'lodash';
import {injectIntl} from 'react-intl';
import {useIndicatorConfig} from '../../hooks/useAppConfig.ts';
import LinkifiedText from './LinkifiedText';
import {GF} from '../../gf-colors';
import {ComparisonMapContext} from '../provider/comparisonMapProvider';
import {Typography, Tooltip} from '@mui/material';
import {FormattedMessage} from 'react-intl';
// Export Image Component
import ExportImageComponent from '../uielements/ExportImage.js';

const normalizeDotName = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-_]/g, '').toLowerCase();

const styles = makeStyles({
  MapContainer: {
    backgroundColor: 'white',
    height: '100%',
  },
  mapTitle: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // vertical centering
    top: 13,
    left: 0,
    right: 0,
    width: '100%', // ensure it fills the parent
    height: 30,
    zIndex: 1000,
    pointerEvents: 'none', // allows clicks to pass through
  },
  mapTitleText: {
    fontWeight: 500,
    backgroundColor: 'white',
    padding: '0 10px',
  },
  note_diff: {
    position: 'absolute',
    fontSize: '0.8rem',
    // 70% opaque background only, so the note's text and links stay fully opaque
    backgroundColor: chroma(GF.yellowLight).alpha(0.7).css(),
    padding: '5px',
    left: 13,
    whiteSpace: 'pre-wrap',
    display: 'flex',
    width: 'fit-content',
    marginRight: 70,
    bottom: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  extraInfo: {
    marginLeft: 5,
    color: 'white',
    backgroundColor: '#256baf',
    cursor: 'pointer',
    padding: '0 5px',
  },
  flex: {
    display: 'flex',
    width: 'fit-content',
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
  'model_predictions',
  'low_model_predictions',
  'incidence',
];

export const isIncidenceMap = (indicator:string) => {
  return IncidenceMap.includes(indicator);
};

const MapComponent = (props: any) => {
  const {mapData, geoJson, height, selectPlace, selectedMapTheme, primary, indicator, intl} = props;
  const selectedDiffMap = useSelector((state:any) => state.filters.selectedDiffMap);
  const selectedLegendSync = useSelector((state:any) => state.filters.selectedLegendSync);
  const currentYear = useSelector((state:any) => state.filters.currentYear);
  const selectedYear = useSelector((state:any) => state.filters.selectedYear);
  const primaryIndicator = useSelector((state:any) => state.filters.selectedIndicator);
  const mapLegendMax = useSelector((state:any) => state.filters.mapLegendMax);
  const mapLegendMin = useSelector((state:any) => state.filters.mapLegendMin);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [unselectedLayer, setUnselectedLayer] = useState('');
  const indicatorConfig = useIndicatorConfig(indicator) || {
    unitLabel: indicator, multiper: 1, unit: '', mapLabel: '%',
    decimalPt: 2, legendLabel: '%',
  };
  const mapLabel = indicatorConfig.mapLabel ?
    intl.formatMessage({id: indicatorConfig.mapLabel, defaultMessage: indicatorConfig.mapLabel}) :
    (indicatorConfig.unit || '');
  const mainSpeciesName = indicatorConfig.mainSpeciesName;
  // Extra info text for the dashboard language, falling back to the other language; without
  // either, the `extraInfo` switch shows the older `{indicator}_extra_info` message
  const isFrench = (intl.locale || '').startsWith('fr');
  const extraInfoText = isFrench ?
    (indicatorConfig.extraInfoFr || indicatorConfig.extraInfoEn) :
    (indicatorConfig.extraInfoEn || indicatorConfig.extraInfoFr);
  const hasExtraInfo = Boolean(extraInfoText) || indicatorConfig.extraInfo;
  const {latLngClicked, setLatLngClicked, zoom, setZoom, center, setCenter} = useContext(ComparisonMapContext);

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
      return primaryIndicator === 'neg_covars' || primaryIndicator === 'pos_covars';
    } else {
      return indicator === 'neg_covars' || indicator === 'pos_covars';
    }
  };

  const legend = useRef(null);
  const geojsonRef = useRef<GeoJSON>(null);

  interface FeatureAddOn extends GeoJSONOptions {
    name: string,
    NAME: string,
    clicked: boolean,
    iso_a3: string,
  };

  const classes = styles();
  const chart = useRef() as React.MutableRefObject<HTMLDivElement>;
  const mapContainerRef = useRef<HTMLDivElement>(null);
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
      click: (() => {
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
      fillOpacity: 0.9,
    });

    if (e.latlng && !fromEffect) {
      setLatLngClicked({...e.latlng, LGA: feature.feature.properties.name});
    };

    showPopup(e);
  };

  const showPopup = (e: any) => {
    const feature = e.target;
    if (feature && feature.feature) {
      const region = _.find(mapData, (item) => normalizeDotName(item.id ?? '') === normalizeDotName(feature?.feature?.id ?? ''));

      if (region) {
        const regionName = region.id.split(':').splice(2).join(':');
        let entireMsg = regionName;
        if (region.others) {
          // for indicators with additional data
          const rowHTML = (val1: string, val2: string, val3: string) => (
            '<div class="row"><div class="col">' + val1 + '</div><div>' + val2 + val3 + '</div></div>'
          );
          entireMsg = '<div class="popupCustom">';
          entireMsg += '<div class="row border"><div class="col">'+ regionName +'</div></div>';
          entireMsg += rowHTML(mainSpeciesName, Number((region.value * indicatorConfig.multiper).toFixed(indicatorConfig.decimalPt)).toLocaleString(), mapLabel);

          for (const key in region.others) {
            if (key) {
              if (isNaN(region.others[key])) {
                entireMsg += rowHTML(intl.formatMessage({id: key}), region.others[key], '');
              } else {
                entireMsg += rowHTML(key, Number((region.others[key] * indicatorConfig.multiper).toFixed(indicatorConfig.decimalPt)).toLocaleString(), mapLabel);
              }
            }
          }
          entireMsg += '</div>';
        } else {
          entireMsg += ' : <b>' + Number((region.value * indicatorConfig.multiper).toFixed(indicatorConfig.decimalPt)).toLocaleString() +
          '</b> ' + mapLabel + '<br/>';
        };

        window.L.popup()
            .setLatLng(e.latlng)
            .setContent(entireMsg)
            .openOn(mapObj);
      } else {
      // no data popup
        const region = feature?.feature?.id?.split(':').splice(2).join(':') ?? '';
        window.L.popup()
            .setLatLng(e.latlng)
            .setContent(region + ': <b>' + intl.formatMessage({id: 'NoData_short'}) +'</b>')
            .openOn(mapObj);
      }
    }
  };

  const resetHighlight = (e: LeafletMouseEvent) => {
    if (geojsonRef.current) {
      geojsonRef.current.resetStyle(e.target);
    }
  };

  const themeStr = _.find(extenededlegendTheme, {color: selectedMapTheme as any});

  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme).domain([minValue, maxValue]).classes(numberOfSteps);

  const standardFeatureHandler = (feature:Feature) => {
    const region = _.find(mapData, (item) => normalizeDotName(item.id ?? '') === normalizeDotName(String(feature?.id ?? '')));
    if (region && region.value != null) {
      const colors = _.get(_.find(customTheme, {color: selectedMapTheme as any}), 'values');

      let color2 = 'grey';
      try {
        color2 = !isCovariateMap() ? scale(region.value) :
          colors[region.value-1];
      } catch (e) {
        console.log('Error in color setting');
      }
      return {fillColor: isCovariateMap() ? '' : color2, fillOpacity: isCovariateMap() ? 0.02 : 0.7, fill: true, color: 'grey', weight: 1};
    } else {
      return {color: 'grey', weight: 1, fillColor: ''};
    }
  };

  /**
   * Map setup
   */
  const mapSetup = function() {
    const L = require('leaflet');
    // const initialView = [14.4, -15];
    const defaultView: [number, number] = [0, 20];
    const defaultZoom = 3;

    // Restore previously saved view (zoom/center) from context so that
    // remounts triggered by control changes (admin toggle, year, theme, ...)
    // don't snap the map back to the default view.
    const hasSavedView = !!(center && typeof center.lat === 'number' && typeof center.lng === 'number' &&
      typeof zoom === 'number' && zoom > 0);
    const startCenter: [number, number] = hasSavedView ? [center.lat, center.lng] : defaultView;
    const startZoom = hasSavedView ? zoom : defaultZoom;

    if (mapObj) {
      return;
    }

    mapObj = L.map(mapContainerRef.current, {
      zoomSnap: 0.25,
      zoomDelta: 0.25,
      scrollWheelZoom: false}).setView(startCenter, startZoom) as MapExtension;

    // Zoom only while Ctrl (or Cmd on macOS) is held, so a plain wheel scroll
    // still scrolls the page instead of being swallowed by the map.
    mapObj.getContainer().addEventListener('wheel', (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) {
        return;
      }
      e.preventDefault();
      const delta = e.deltaY < 0 ? mapObj.options.zoomDelta : -mapObj.options.zoomDelta;
      mapObj.setZoomAround(mapObj.mouseEventToLatLng(e), mapObj.getZoom() + delta);
    }, {passive: false});

    // create map layer
    geojson = L.geoJSON(geoJson, {
      style: (feature: Feature) => {
        return standardFeatureHandler(feature);
      },
      onEachFeature: onEachFeature,
    });

    geojsonRef.current = geojson;
    geojson.addTo(mapObj);

    // Zoom to the geographic extent of features that have indicator data, but
    // only on a fresh mount — when a saved view exists, honor it instead so
    // control-toggle remounts don't override the user's zoom/pan.
    if (!hasSavedView) {
      const maxFitZoom = 6.6;
      // Generous padding suits a single country (the fit is capped by
      // maxFitZoom anyway), but for continent-scale extents (e.g. Africa) it
      // eats most of the viewport and forces a far zoom-out, so fall back to
      // a tight padding whenever the large padding would push below the cap.
      const fitToBounds = (bounds: any) => {
        const largePadding = L.point(0, 0);
        const largePaddingZoom = mapObj.getBoundsZoom(bounds, false, largePadding.multiplyBy(2));
        // Continent-scale: extra top padding keeps the northern edge clear of the map title.
        const paddingOpts = largePaddingZoom < maxFitZoom ?
          {paddingTopLeft: [0, 100] as [number, number], paddingBottomRight: [0, 0] as [number, number]} :
          {padding: [180, 180] as [number, number]};

        mapObj.fitBounds(bounds, {...paddingOpts, animate: false, maxZoom: maxFitZoom});
      };
      if (mapData && mapData.length > 0 && geoJson && geoJson.features) {
        const dataIds = new Set(mapData.filter((d: any) => d.value != null).map((d: any) => normalizeDotName(d.id)));
        const featuresWithData = geoJson.features.filter((f: any) => dataIds.has(normalizeDotName(f.id)));
        if (featuresWithData.length > 0) {
          const dataBounds = L.geoJSON({type: 'FeatureCollection', features: featuresWithData}).getBounds();
          if (dataBounds.isValid()) fitToBounds(dataBounds);
        } else if (geojson.getBounds().isValid()) {
          fitToBounds(geojson.getBounds());
        }
      } else if (geojson.getBounds().isValid()) {
        fitToBounds(geojson.getBounds());
      }
    }

    const layerControl = L.control.layers().addTo(mapObj);

    // Add a street basemap as an overlay, visible by default. Esri's World
    // Street Map renders English/Latin labels globally (unlike the default OSM
    // tiles, which show local-language names, e.g. Amharic in Ethiopia).

    const esriCanvas = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
    const osmLayer = L.layerGroup([
      L.tileLayer(esriCanvas + 'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution:
          'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
        maxZoom: 16,
      }),
      L.tileLayer(esriCanvas + 'World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
      }),
    ]);
    osmLayer.addTo(mapObj);
    layerControl.addOverlay(osmLayer, 'Street map');

    mapObj.on('overlayadd', (data)=>{
      if (_.get(data, 'layer.options._zIndex')) { // mostly for district names
        data.layer.setZIndex(data.layer.options._zIndex);
      }
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
      showPopup(mouseEvent);
    }
  }, [latLngClicked]);

  useEffect(() => {
    if (geojsonRef.current && mapObj && mapData && mapData.length > 0) {
      geojsonRef.current.setStyle((feature: Feature) => standardFeatureHandler(feature));
    }
  }, [mapObj, mapData, minValue, maxValue, selectedMapTheme]);

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

  // Leaflet caches container dimensions at init and doesn't observe DOM
  // resizes. When the comparison toggle reflows the primary panel (md=12 →
  // md=6) or unhides the comparison panel (display:none → visible), the
  // tiles stay sized to the old container, leaving the map clipped inside
  // its div. invalidateSize() forces Leaflet to recompute.
  useEffect(() => {
    if (!mapObj || !mapContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      mapObj.invalidateSize();
    });
    ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, [mapObj]);

  // The indicator's data source for the dashboard language (falling back to the other
  // language), else the older per-indicator translation message
  const dataSourceText = isFrench ?
    (indicatorConfig.dataSourceFr || indicatorConfig.dataSourceEn) :
    (indicatorConfig.dataSourceEn || indicatorConfig.dataSourceFr);
  const dataSourceMsgId = 'data_source_' + indicator;
  const dataSourceMsg = dataSourceText ?
    intl.formatMessage({id: 'data_source'}) + ': ' + dataSourceText :
    (intl.messages[dataSourceMsgId] ? intl.formatMessage({id: dataSourceMsgId}) : '');


  return (
    <div style={{position: 'relative', width: '100%', height: '100%', minHeight: height, overflow: 'hidden'}}>
      <div
        ref={chart}
        style={{position: 'relative', width: '100%', height: '100%'}}
      >
        <div className={classes.mapTitle}>
          {/* Map Title */}
          {indicator && <Typography variant="h5" className={classes.mapTitleText}>{intl.formatMessage({id: indicator})}</Typography>}
        </div>
        <div className={classes.MapContainer} id="chartContainer">
          <div ref={mapContainerRef} style={{width: '100%', height: '100%'}} />
        </div>
        <ExportImageComponent
          targetNode={chart.current}
          fileName="map.png"
        />
        {/* Map Legend */}
        <MapLegend minValue={minValue} numberOfSteps={numberOfSteps} mapLegendMax={maxValue}
          selectedMapTheme={selectedMapTheme} legend={legend} primary={primary} selectedLayer={selectedLayer}
          unselectedLayer={unselectedLayer}
          selectedIndicator={indicator}
          key={minValue + maxValue + selectedLayer + indicator} />

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
        {/* Caveat note */}
        {
          <div className={classes.note_diff}>
            {dataSourceMsg &&
              <div className={classes.flex} title={dataSourceMsg}>
                <span><LinkifiedText text={dataSourceMsg} linkText='link'/></span>
              </div>
            }
            {hasExtraInfo &&
              <div>
                <Tooltip title={extraInfoText ?
                  <div style={{padding: '10px 20px', fontSize: '0.9rem', whiteSpace: 'pre-wrap'}}>
                    <LinkifiedText text={extraInfoText}/>
                  </div> :
                  extraInfo(indicator)}
                componentsProps={{
                  tooltip: {
                    sx: {
                      minWidth: 500,
                    },
                  },
                }}
                >
                  <div className={classes.extraInfo}>
                    <FormattedMessage id="extra_info" />
                  </div>
                </Tooltip>
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
};

export default injectIntl(MapComponent);
