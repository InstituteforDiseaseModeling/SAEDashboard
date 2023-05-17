import React, {useLayoutEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import chroma from 'chroma-js';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import customTheme from '../../customTheme.json';
import {Typography} from '@mui/material';
import {createLegend} from './MapUtil';

const styles = {
  bottomLabel: {
    top: -22,
    position: 'relative',
    width: '100%',
    textAlign: 'center',
    textDecoration: 'underline',
  },
};

/**
 * Map component
 * @param {*} props - component properies
 * @return {*} Map Component
 */
const Map = (props) => {
  const {mapData, geoJson, height, zoomLevel, selectedMapTheme,
    classes, selectPlace, primary} = props;

  const selectedState = useSelector((state) => state.filters.selectedState);
  const mapLegendMax = useSelector((state) => state.filters.mapLegendMax);


  // References to DOM elements
  const chart = useRef(null);
  const series = useRef(null);
  const chartId = _.uniqueId('chart');
  const clickTarget = useRef(null);
  const defaultTarget = useRef(null);
  const currentSelectedLegend = useRef(null);

  // Data-related variables
  const minValue = 0;
  const numberOfSteps = 10;
  // To get a continuous color scheme, remove the .classes()
  const themeStr = _.find(customTheme, {color: selectedMapTheme});

  let scale = chroma.scale(themeStr ?
    themeStr.values :
    selectedMapTheme).domain([minValue, mapLegendMax]).classes(numberOfSteps);

  useLayoutEffect(() => {
    scale = chroma.scale(themeStr ?
      themeStr.values :
      selectedMapTheme).domain([minValue, mapLegendMax]).classes(numberOfSteps);

    // Create the map
    const x = am4core.create(chartId, am4maps.MapChart);

    /* Create legend */
    createLegend(x, mapLegendMax, minValue, numberOfSteps, selectedMapTheme);

    x.homeZoomLevel = zoomLevel;

    // Configure
    x.projection = new am4maps.projections.Mercator();
    x.paddingBottom = 50;
    x.zoomControl = new am4maps.ZoomControl();

    if (primary) {
      x.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    }


    // Create map polygon series
    const polygonSeries = x.series.push(new am4maps.MapPolygonSeries());

    // Adapter to pick colors from the scale
    polygonSeries.mapPolygons.template.adapter.add('fill', function(
        fill,
        mapPolygon,
    ) {
      return am4core.color(scale(mapPolygon.dataItem.values['value'].workingValue).hex());
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.sortPolygonsBy = 'none';

    const polygonTemplate = polygonSeries.mapPolygons.template;
    const hs = polygonTemplate.states.create('hover');
    hs.properties.opacity = .75;
    polygonTemplate.tooltipText = '{id}: {percentage}';
    polygonTemplate.fill = am4core.color('#f5f5f5');


    polygonSeries.mapPolygons.template.events.on('out', function(ev) {
      // Deselect the legend if needed
      if (currentSelectedLegend.current) {
        currentSelectedLegend.current.style.border = null;
      }
    });

    // Bind the click eventd


    x.goHome();

    const resetDefaultStyles = (region) => {
      if (region) {
        region.zIndex = 1;
        region.stroke = am4core.color('#ffffff');
        region.strokeWidth = 1;
      }
    };
    const highlightStyles = (region) => {
      if (region) {
        region.zIndex = 10000;
        region.stroke = am4core.color('#fffe1e');
        region.strokeWidth = 2;
      }
    };

    if (selectPlace && primary) {
      polygonTemplate.events.on('hit', function(ev) {
        x.goHome();

        selectPlace(ev.target.dataItem.dataContext.id);

        resetDefaultStyles(defaultTarget.current);
        resetDefaultStyles(clickTarget.current);
        clickTarget.current = ev.target;
        highlightStyles( ev.target );
      });
    }

    polygonTemplate.events.on('ready', function(ev) {
      if ( primary && _.get(ev, 'target.dataItem.dataContext.id') == selectedState) {
        highlightStyles(ev.target);
        defaultTarget.current = ev.target;
      } else {
        resetDefaultStyles(ev.target);
      }
    });

    selectPlace(selectedState);
    // Enable export
    x.exporting.menu = new am4core.ExportMenu();


    chart.current = x;
    series.current = polygonSeries;

    return () => {
      x.dispose();
    };
  }, []);

  // When chart data prop changes it will update the chart
  useLayoutEffect(() => {
    // Set it in the chart
    mapData.forEach( (item)=>{
      item.percentage = (item.value* 100).toFixed(2) + '%';
    });

    series.current.data = mapData;
    series.current.geodata = geoJson;
  }, [mapData, geoJson]);

  if (chart.current) {
    chart.current.goHome();
  }

  return (
    <div style={{position: 'relative', width: '100%', height: '100%', minHeight: height}}>
      <div id={chartId} style={{width: '100%', height: '100%'}} />
      {primary &&
        <div className={classes.bottomLabel}>
          <Typography variant="subtitle2">
            To show the time-series plots, click a region on the main map
          </Typography>
        </div>
      }
    </div>
  );
};

Map.propTypes = {
  selectPlace: PropTypes.func.isRequired,
  mapData: PropTypes.array,
  geoJson: PropTypes.object,
  height: PropTypes.number,
  zoomLevel: PropTypes.number,
  selectedMapTheme: PropTypes.string,
  classes: PropTypes.object,
  primary: PropTypes.bool,
};

export default withStyles(styles)(Map);
