import React, {useLayoutEffect, useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import withStyles from '@mui/styles/withStyles';
import {ChartContext} from '../context/chartContext';

const styles = ({
  title: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: '1.25rem',
  },
});

/**
 * Function setting default parameters for am4charts axis
 * @param {*} axis Axis to setup
 */
const setUpAxis = (axis) => {
  axis.renderer.grid.template.strokeDasharray = '2,3';
  axis.renderer.labels.template.fill = am4core.color('#585a55');
  axis.renderer.grid.template.strokeOpacity = 0.07;
};

/**
 * LineChart component
 * @param {*} props
 * @return {React.ReactElement}
 */
const LineChart = (props) => {
  const chart = useRef(null);
  const chartId = _.uniqueId('chart');
  const {maxYAxisVal, setMaxYAxisVal} = useContext(ChartContext);
  const {minYAxisVal, setMinYAxisVal} = useContext(ChartContext);

  const creatSeries = (x, yAxis) => {
    const series = x.series.push(new am4charts.LineSeries());
    series.simplifiedProcessing = true;
    series.name = 'Model post. median '+props.channel + ' (cases / 1000ppl)';
    series.dataFields.dateX = 'yearDate';
    series.dataFields.valueY = 'middle';
    series.tooltipText = '{year} : {middle}';
    series.fill = am4core.color('#e07b39');
    series.stroke = am4core.color('#e07b39');
    series.bullets.push(new am4charts.CircleBullet());
  };

  useLayoutEffect(() => {
    const x = am4core.create(chartId, am4charts.XYChart);

    const xAxis = x.xAxes.push(new am4charts.DateAxis());
    setUpAxis(xAxis);
    xAxis.numberFormatter.numberFormat = '#';
    xAxis.renderer.minGridDistance = 50;
    xAxis.title.text = 'year';

    const yAxis = x.yAxes.push(new am4charts.ValueAxis());
    setUpAxis(yAxis);
    yAxis.numberFormatter.numberFormat = '#.##';
    yAxis.extraTooltipPrecision = 1;
    yAxis.title.text = 'cases / 1000';

    // Create chart
    creatSeries(x, yAxis);

    x.cursor = new am4charts.XYCursor();
    x.cursor.xAxis = xAxis;
    x.cursor.yAxis = yAxis;

    x.legend = new am4charts.Legend();
    x.legend.zIndex = 100;

    x.legend.paddingLeft = '5px';
    x.legend.paddingTop = '-15px';
    x.legend.position = 'bottom';
    x.legend.height = '100px';

    // add Event
    addEventAxis(xAxis, new Date(2021, 6, 1), 'Event-1');

    // Enable export
    // x.exporting.menu = new am4core.ExportMenu();

    // Prepare the data and set it in the chart
    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [props.channel]);

  const addEventAxis = (axisObj, value, labeltext) => {
    const range = axisObj.axisRanges.create();
    range.grid.stroke = am4core.color('blue');
    range.grid.strokeWidth = 2;
    range.grid.strokeOpacity = 1;

    range.label.text = labeltext;
    range.label.fill = am4core.color('red');
    range.label.dy = -220;

    range.value = value;
  };

  // for setting Max Y axis value based on chartdata
  const setYAxis = () => {
    const maxdata = _.maxBy(props.chartData, (o)=> {
      if (o.reference_upper_bound && (o.reference_upper_bound > o.upper_bound)) {
        return o.reference_upper_bound;
      } else {
        return o.upper_bound;
      }
    });

    if (maxdata && maxdata.reference_upper_bound &&
      maxdata.reference_upper_bound > maxdata.upper_bound &&
        maxdata.reference_upper_bound > maxYAxisVal) {
      setMaxYAxisVal(maxdata.reference_upper_bound);
    } else if (maxdata && maxdata.upper_bound > maxYAxisVal) {
      setMaxYAxisVal(maxdata.upper_bound);
    }

    const minData = _.minBy(props.chartData, (o)=> {
      if (o.reference_lower_bound && (o.reference_lower_bound < o.lower_bound)) {
        return o.reference_lower_bound;
      } else {
        return o.lower_bound;
      }
    });

    if (minData && minData.reference_lower_bound &&
      minData.reference_lower_bound < minData.lower_bound &&
      minData.reference_lower_bound < minYAxisVal) {
      setMinYAxisVal(minData.reference_lower_bound);
    } else if (minData && minData.lower_bound < minYAxisVal) {
      setMinYAxisVal(minData.lower_bound);
    }


    if (maxYAxisVal > 0) {
      chart.current.yAxes.values[0].max =maxYAxisVal;
    }
    if (minYAxisVal < 1000) {
      chart.current.yAxes.values[0].min = minYAxisVal;
    }
  };

  /**
   * add date field in data for display purpose
   * @return {JSON} data object with additional yearData field
   */
  const addDateField = () => {
    const chartData = props.chartData.map((data) => {
      data.yearDate = new Date(data.year, 0, 1);
      return data;
    });
    return chartData;
  };

  // When chart data prop changes it will update the chart
  useLayoutEffect(() => {
    // Set it in the chart
    chart.current.data = addDateField();

    setYAxis();
  }, [props.chartData]);


  // ---------------------------------------------------------------------------
  // for YAxis scaling sync among charts
  // ---------------------------------------------------------------------------
  useLayoutEffect(()=> {
    setYAxis();
    chart.current.yAxes.values[0].strictMinMax = true;
  }, [maxYAxisVal, minYAxisVal]);

  return (
    <>
      {/* <Typography variant="h5" className={classes.title}> {props.title} </Typography> */}
      <div id={chartId} style={{width: '100%', height: '300px', fontSize: '0.9em'}}/>
    </>
  );
};

LineChart.propTypes = {
  classes: PropTypes.object,
  channel: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  title: PropTypes.string,
};

export default withStyles(styles)(LineChart);
