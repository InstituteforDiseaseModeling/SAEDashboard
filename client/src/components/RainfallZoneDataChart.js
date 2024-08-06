import React, {useEffect, useRef} from 'react';
import withStyles from '@mui/styles/withStyles';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import RainfallData from '../data/SEN_Climate_4Regions_2018_2023.json';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

const styles = {
  title: {
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
  root: {
    width: '100%',
    height: '300px',
    fontSize: '0.9em',
    marginTop: 80,
  },
};

const RainfallDataChart = (props) => {
  const {classes} = props;
  const chart = useRef(null);
  const chartId = _.uniqueId('rainfallchart');
  const selectedRainfallZone = useSelector((state) => state.filters.selectedRainfallZone);
  const currentYear = useSelector((state) => state.filters.currentYear);


  /**
   * Function setting default parameters for am4charts axis
   * @param {*} axis Axis to setup
   */
  const setUpAxis = (axis) => {
    axis.renderer.grid.template.strokeDasharray = '2,3';
    axis.renderer.labels.template.fill = am4core.color('#585a55');
    axis.renderer.grid.template.strokeOpacity = 0.07;
  };

  const createSeries = (x, yAxis) => {
    const series = x.series.push(new am4charts.LineSeries());
    series.simplifiedProcessing = true;
    series.name = ''; // props.intl.formatMessage({id: 'chart_'+props.channel});
    series.dataFields.dateX = 'yearDate';
    series.dataFields.valueY = 'Average_rain_mm';
    series.tooltipText = '{yearDate} : {valueY}';
    series.fill = am4core.color('#e07b39');
    series.stroke = am4core.color('#e07b39');
    series.bullets.push(new am4charts.CircleBullet());
  };

  const chartSetup = (xychart, data) => {
    xychart.numberFormatter = new am4core.NumberFormatter();
    xychart.numberFormatter.numberFormat = '#,###.##';
    const xAxis = xychart.xAxes.push(new am4charts.DateAxis());
    xychart.dateFormatter.dateFormat = 'yyyy-MM';

    setUpAxis(xAxis);

    const yAxis = xychart.yAxes.push(new am4charts.ValueAxis());
    yAxis.numberFormatter = new am4core.NumberFormatter();
    yAxis.numberFormatter.numberFormat = '#.## ';
    yAxis.extraTooltipPrecision = 1;

    setUpAxis(yAxis);

    yAxis.title.text = 'avg rainfall (mm)';

    createSeries(xychart, yAxis);

    xychart.cursor = new am4charts.XYCursor();
    xychart.cursor.xAxis = xAxis;
    xychart.cursor.yAxis = yAxis;

    xychart.legend = new am4charts.Legend();
    xychart.legend.zIndex = 100;

    xychart.legend.paddingLeft = '5px';
    xychart.legend.paddingTop = '0px';
    xychart.legend.position = 'bottom';
    xychart.legend.height = '100px';

    chart.current = xychart;
    chart.current.data = data;
  };


  /**
   * add date field in data for display purpose
   * @return {JSON} data object with additional yearData field
   */
  const prepareData = () => {
    // remove total month records
    const removeTotal = RainfallData.filter((data) => data.Month !== 'Total' &&
      data.Year === currentYear);

    let chartData = removeTotal.map((data) => {
      data.yearDate = new Date(data.Year, data.Month-1, 1);
      return data;
    });
    chartData = _.orderBy(chartData, ['year', 'month'], ['asc, asc']);
    return chartData;
  };

  const filterData = (data, zone) => {
    const filteredData = data.filter((d) => d.Zone === zone);
    return filteredData;
  };

  useEffect(() => {
    const xychart = am4core.create(chartId, am4charts.XYChart);
    chartSetup(xychart, RainfallData);

    chart.current.data = filterData(prepareData(), selectedRainfallZone);

    return () => {
      xychart.dispose();
    };
  }, [selectedRainfallZone]);

  return (
    <div id={chartId} className={classes.root}/>

  );
};


RainfallDataChart.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(RainfallDataChart);
