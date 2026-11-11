/* eslint-disable max-len */
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import * as _ from 'lodash';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js/dist/plotly';
import {injectIntl} from 'react-intl';
import {ChartContext, yRangeKey} from '../context/chartContext';
import {useIndicatorConfig} from '../../hooks/useAppConfig.ts';
import {isNum, formatValue as formatNumber} from './formatValue';
import {GF} from '../../gf-colors';

const colors = [
  '#F85C02',
  '#248AF9',
  '#D83397',
  '#3AC9B1',
  '#D93027',
  '#BA400A',
];

const REFERENCE_COLOR = GF.slate80;

const GRID_COLOR = 'rgba(88, 90, 85, 0.07)';
const SPIKE_COLOR = '#999';

const VALUE_FIELDS = ['middle', 'upper_bound', 'lower_bound',
  'reference_middle', 'reference_upper_bound', 'reference_lower_bound'];

const LineChart = (props) => {
  const {yAxisRange, reportYRange} = useContext(ChartContext);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const indicators = useSelector((state) => state.filters.indicators);
  const indicator = props.channel;
  const indicatorConfig = useIndicatorConfig(indicator);

  const unit = _.get(indicatorConfig, 'unit', '');
  const ignoreOthers = !props.combined && _.get(indicatorConfig, 'ignoreOthers', false);
  const decimalPt = _.get(indicatorConfig, 'decimalPt');
  const multiplier = _.get(indicatorConfig, 'multiper', 1);

  const [clickedPoints, setClickedPoints] = useState([]);
  const [hoverYValue, setHoverYValue] = useState(null);
  const [hoverXValue, setHoverXValue] = useState(null);

  const indicatorName = _.get(_.find(indicators, {id: indicator}), 'text', indicator);

  const translate = (id) => {
    if (!id) {
      return '';
    }
    return props.intl.messages[id] ? props.intl.formatMessage({id}) : id;
  };

  const formatValue = (v) => formatNumber(v, decimalPt, selectedLocale);

  const hasMonthly = useMemo(
      () => _.some(props.chartData, (d) => isNum(d.month)),
      [props.chartData],
  );

  const prepareData = () => {
    const chartData = (props.chartData || []).map((data) => {
      const newData = {...data};
      newData.yearDate = new Date(Date.UTC(data.year, isNum(data.month) ? data.month - 1 : 0, 1));
      VALUE_FIELDS.forEach((field) => {
        if (isNum(newData[field])) {
          newData[field] = newData[field] * multiplier;
        }
      });
      if (data.others && !ignoreOthers) {
        const scaledOthers = {};
        Object.keys(data.others).forEach((key) => {
          scaledOthers[key] = data.others[key] * multiplier;
          newData[key] = scaledOthers[key];
        });
        newData.others = scaledOthers;
      }
      return newData;
    });
    return _.orderBy(chartData, ['year', 'month'], ['asc', 'asc']);
  };

  const calculateYAxisRange = (chartData) => {
    const highs = [];
    const lows = [];

    chartData.forEach((o) => {
      const values = [o.middle, o.upper_bound, o.lower_bound,
        o.reference_middle, o.reference_upper_bound, o.reference_lower_bound];
      if (o.others && !ignoreOthers) {
        Object.keys(o.others).forEach((key) => values.push(o.others[key]));
      }
      const present = values.filter(isNum);
      if (present.length) {
        highs.push(_.max(present));
        lows.push(_.min(present));
      }
    });

    return {dataMax: _.max(highs), dataMin: _.min(lows)};
  };

  useEffect(() => {
    const {dataMax, dataMin} = calculateYAxisRange(prepareData());

    if (isNum(dataMin) && isNum(dataMax)) {
      reportYRange(yRangeKey(props.channel, props.selectedState, props.title),
          {min: dataMin, max: dataMax});
    }
  }, [props.chartData, props.channel, props.selectedState, props.title, multiplier, ignoreOthers]);

  const {traces, layout} = useMemo(() => {
    const processedData = prepareData();

    if (processedData.length === 0) {
      return {traces: [], layout: {}};
    }

    const traces = [];
    const xValues = processedData.map((d) => hasMonthly ? d.yearDate : d.year);

    const mainValues = processedData.map((d) => isNum(d.middle) ? d.middle : null);
    const upperBounds = processedData.map((d) => isNum(d.upper_bound) ? d.upper_bound : null);
    const lowerBounds = processedData.map((d) => isNum(d.lower_bound) ? d.lower_bound : null);

    const hasMainSeries = mainValues.some(isNum);
    const hasErrorBand = upperBounds.some((u, i) =>
      isNum(u) && isNum(lowerBounds[i]) && isNum(mainValues[i]) &&
      (u !== mainValues[i] || lowerBounds[i] !== mainValues[i]),
    );

    const hoverTemplate = '<b>%{fullData.name}</b><br>%{text}' + unit + '<extra></extra>';

    if (hasErrorBand) {
      traces.push({
        x: xValues,
        y: upperBounds,
        type: 'scatter',
        mode: 'lines',
        line: {color: 'transparent'},
        showlegend: false,
        hoverinfo: 'skip',
      });

      traces.push({
        x: xValues,
        y: lowerBounds,
        name: translate('credible_interval'),
        type: 'scatter',
        mode: 'lines',
        line: {color: 'transparent'},
        fill: 'tonexty',
        fillcolor: 'rgba(248, 92, 2, 0.2)',
        hoverinfo: 'skip',
      });
    }

    if (hasMainSeries) {
      traces.push({
        x: xValues,
        y: mainValues,
        name: indicatorName,
        type: 'scatter',
        mode: 'lines+markers',
        connectgaps: false,
        line: {color: colors[0], width: 2},
        marker: {color: GF.white, size: 6, line: {color: colors[0], width: 2}},
        text: mainValues.map(formatValue),
        hovertemplate: hoverTemplate,
      });
    }

    const otherKeys = ignoreOthers ? [] : _.uniq(
        _.flatMap(processedData, (d) => d.others ? Object.keys(d.others) : []),
    );
    otherKeys.forEach((key, index) => {
      const seriesValues = processedData.map((d) => isNum(d[key]) ? d[key] : null);
      const color = colors[(index + (props.combined ? 0 : 1)) % colors.length];
      traces.push({
        x: xValues,
        y: seriesValues,
        name: translate(key),
        type: 'scatter',
        mode: 'lines+markers',
        connectgaps: false,
        line: {color, width: 2},
        marker: {color: GF.white, size: 6, line: {color, width: 2}},
        text: seriesValues.map(formatValue),
        hovertemplate: hoverTemplate,
      });
    });

    const referenceValues = processedData.map((d) => isNum(d.reference_middle) ? d.reference_middle : null);
    if (referenceValues.some(isNum)) {
      const plus = processedData.map((d) =>
        isNum(d.reference_upper_bound) && isNum(d.reference_middle) ?
          d.reference_upper_bound - d.reference_middle : 0);
      const minus = processedData.map((d) =>
        isNum(d.reference_lower_bound) && isNum(d.reference_middle) ?
          d.reference_middle - d.reference_lower_bound : 0);

      traces.push({
        x: xValues,
        y: referenceValues,
        name: translate('reference_data'),
        type: 'scatter',
        mode: 'markers',
        marker: {color: GF.white, size: 7, line: {color: REFERENCE_COLOR, width: 2}},
        error_y: {
          type: 'data',
          symmetric: false,
          array: plus,
          arrayminus: minus,
          color: REFERENCE_COLOR,
          thickness: 2,
          width: 4,
        },
        text: referenceValues.map(formatValue),
        hovertemplate: hoverTemplate,
      });
    }

    const shapes = [];
    if (Array.isArray(props.eventData)) {
      props.eventData.forEach((event) => {
        if (!event || !event.start_date) {
          return;
        }
        const eventDate = new Date(event.start_date);
        if (isNaN(eventDate.getTime())) {
          return;
        }
        const x = hasMonthly ? eventDate :
          eventDate.getUTCFullYear() + eventDate.getUTCMonth() / 12;
        shapes.push({
          type: 'line',
          x0: x,
          x1: x,
          y0: 0,
          y1: 1,
          yref: 'paper',
          line: {color: colors[1], width: 2, dash: 'dot'},
        });
      });
    }

    const {dataMax, dataMin} = calculateYAxisRange(processedData);
    const yHigh = yAxisRange ? yAxisRange.max : dataMax;
    const yLow = yAxisRange ? yAxisRange.min : dataMin;
    const span = yHigh - yLow;
    const pad = span > 0 ? span * 0.1 : Math.abs(yHigh || 1) * 0.1;

    const yAxisTitle = translate(_.get(indicatorConfig, 'yAxisLabel')) ||
      [translate(_.get(indicatorConfig, 'unitLabel')), unit ? '(' + unit + ')' : '']
          .filter(Boolean).join(' ');

    const layout = {
      xaxis: {
        title: {text: translate(hasMonthly ? 'year_month' : 'year')},
        showgrid: true,
        gridcolor: GRID_COLOR,
        griddash: 'dot',
        type: hasMonthly ? 'date' : 'linear',
        tickformat: hasMonthly ? '%b %Y' : 'd',
        showspikes: true,
        spikemode: 'across+marker',
        spikesnap: 'cursor',
        spikethickness: 1,
        spikecolor: SPIKE_COLOR,
        spikedash: 'dash',
      },
      yaxis: {
        title: {text: yAxisTitle, standoff: 10},
        automargin: true,
        showgrid: true,
        gridcolor: GRID_COLOR,
        griddash: 'dot',
        range: [yLow - pad, yHigh + pad],
        showspikes: true,
        spikemode: 'toaxis+across+marker',
        spikesnap: 'cursor',
        spikethickness: 1,
        spikecolor: SPIKE_COLOR,
        spikedash: 'dash',
        spikedistance: -1,
        exponentformat: 'B',
      },
      shapes,
      hovermode: 'closest',
      hoverdistance: 20,
      hoverlabel: {
        bgcolor: GF.white,
        bordercolor: GF.slate,
        font: {size: 12, color: GF.slate},
      },
      showlegend: true,
      legend: {orientation: 'h', y: -0.25, x: 0, xanchor: 'left'},
      font: {family: 'Noto Sans, sans-serif'},
      plot_bgcolor: GF.white,
      paper_bgcolor: GF.white,
      autosize: true,
      margin: {l: 60, r: 30, t: 20, b: 80},
      annotations: [
        ...clickedPoints.map((point, index) => ({
          x: point.x,
          y: point.y,
          xref: 'x',
          yref: 'y',
          text: point.text,
          showarrow: true,
          arrowhead: 2,
          arrowsize: 1,
          arrowwidth: 2,
          arrowcolor: GF.slate,
          ax: 0,
          ay: -50 - (index * 15),
          bgcolor: point.color,
          bordercolor: GF.slate,
          borderwidth: 2,
          borderpad: 8,
          font: {color: GF.white, size: 12},
          captureevents: true,
        })),
        ...(isNum(hoverYValue) ? [{
          x: 0,
          y: hoverYValue,
          xref: 'paper',
          yref: 'y',
          text: formatValue(hoverYValue) + unit,
          showarrow: false,
          xanchor: 'right',
          yanchor: 'middle',
          bgcolor: GF.slate,
          bordercolor: GF.slate,
          borderwidth: 1,
          borderpad: 4,
          font: {color: GF.white, size: 12},
        }] : []),
        ...(hoverXValue !== null && hoverXValue !== undefined ? [{
          x: hoverXValue,
          y: 0,
          xref: 'x',
          yref: 'paper',
          text: hasMonthly ?
            new Date(hoverXValue).toLocaleDateString(selectedLocale || undefined,
                {year: 'numeric', month: 'short', timeZone: 'UTC'}) :
            String(hoverXValue),
          showarrow: false,
          xanchor: 'center',
          yanchor: 'top',
          bgcolor: GF.slate,
          bordercolor: GF.slate,
          borderwidth: 1,
          borderpad: 4,
          font: {color: GF.white, size: 12},
        }] : []),
      ],
    };

    return {traces, layout};
  }, [props.chartData, props.eventData, props.combined, selectedLocale, indicator, indicatorName,
    indicatorConfig, hasMonthly, yAxisRange,
    clickedPoints, hoverYValue, hoverXValue]);

  const handlePlotHover = (data) => {
    if (data.points && data.points.length > 0) {
      const point = data.points[0];
      setHoverYValue(point.y);
      setHoverXValue(point.x);
    }
  };

  const handlePlotUnhover = () => {
    setHoverYValue(null);
    setHoverXValue(null);
  };

  const handlePlotClick = (data) => {
    if (!data.points || data.points.length === 0) {
      setClickedPoints([]);
      return;
    }
    const point = data.points[0];
    const pointId = `${point.x}_${point.y}_${point.curveNumber}`;
    const existingIndex = clickedPoints.findIndex(
        (p) => `${p.x}_${p.y}_${p.curveNumber}` === pointId,
    );

    if (existingIndex >= 0) {
      setClickedPoints(clickedPoints.filter((_p, index) => index !== existingIndex));
    } else {
      setClickedPoints([...clickedPoints, {
        x: point.x,
        y: point.y,
        text: `${formatValue(point.y)}${unit} (${point.data.name})`,
        color: _.get(point, 'data.line.color', colors[0]),
        curveNumber: point.curveNumber,
      }]);
    }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png',
      filename: [indicator, props.title].filter(Boolean).join('_') || 'chart',
      height: 600,
      width: 1200,
      scale: 2,
    },
  };

  const containerRef = useRef(null);
  const graphDivRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return undefined;
    let frame = null;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (graphDivRef.current) {
          Plotly.Plots.resize(graphDivRef.current).catch(() => {});
        }
      });
    });
    ro.observe(containerRef.current);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{width: '100%', height: '300px', fontSize: '0.9em', padding: '8px', boxSizing: 'border-box', minWidth: 0}}>
      <Plot
        data={traces}
        layout={layout}
        config={config}
        style={{width: '100%', height: '100%'}}
        useResizeHandler={true}
        onInitialized={(_figure, graphDiv) => {
          graphDivRef.current = graphDiv;
        }}
        onClick={handlePlotClick}
        onHover={handlePlotHover}
        onUnhover={handlePlotUnhover}
      />
    </div>
  );
};

LineChart.propTypes = {
  channel: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  title: PropTypes.string,
  selectedState: PropTypes.string,
  eventData: PropTypes.array,
  combined: PropTypes.bool,
  intl: PropTypes.object,
};

export default injectIntl(LineChart);
