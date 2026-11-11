/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import * as _ from 'lodash';
import {VictoryChart, VictoryAxis, VictoryBar, VictoryGroup, VictoryTheme, VictoryLegend,
  VictoryTooltip, VictoryLabel,
  VictoryStack,
} from 'victory';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {useIndicatorConfig} from '../../hooks/useAppConfig.ts';
import {ChartContext, yRangeKey} from '../context/chartContext';
import {isNum, formatValue} from './formatValue';

const styles = ({
  title: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: '1.25rem',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',

  },
  chartContainer: {
    width: '100%',
    height: '100%',
  },
});

const StackedBarChart = (props) => {
  const {chartData, classes, channel, barType, intl, indicator, selectedState, title} = props;
  const {yAxisRange, reportYRange} = useContext(ChartContext);
  const transformedData = [];
  const channelConfig = useIndicatorConfig(indicator) || {};
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const indicators = useSelector((state) => state.filters.indicators);
  const translate = (id) => id && intl.messages[id] ? intl.formatMessage({id}) : id;
  // Name of the main series: the configured one (`mainSpeciesName`, or the first subgroup of a
  // combined chart), else the indicator's name, as the line chart does
  const mainName = channel || _.get(_.find(indicators, {id: indicator}), 'text', indicator) || '';
  const unit = _.get(channelConfig, 'unit', '');
  // Same display settings as the line chart: `multiper` (sic, from the shared config) scales
  // the raw values, `decimalPt` sets the decimals of the tooltip values
  const multiplier = _.get(channelConfig, 'multiper', 1);
  const scale = (v) => isNum(v) ? v * multiplier : v;
  const tooltip = (name, v) =>
    `${name ? name + ': ' : ''}${formatValue(v, channelConfig.decimalPt, selectedLocale)}${unit}`;

  console.log(barType);

  // first pass to get 'Gambia' data
  const mainData = [];
  chartData.forEach((data) => {
    const year = data.year;
    const transformedItem = {
      x: year.toString(),
      y: scale(data.middle),
      label: tooltip(mainName, scale(data.middle)),
      labelOnly: mainName,
    };
    mainData.push(transformedItem);
  });
  transformedData.push(mainData);

  // second pass to get 'others' data
  if (chartData.length > 0 && chartData[0].others) {
    Object.keys(chartData[0].others).forEach((item) => {
      const othersData = [];
      chartData.forEach((data) => {
        const year = data.year;
        const others = data.others;
        if (others) {
          const transformedItem = {
            x: year.toString(),
            y: scale(data.others[item]),
            label: tooltip(translate(item), scale(data.others[item])),
            labelOnly: translate(item),
          };
          othersData.push(transformedItem);
        }
      });
      transformedData.push(othersData);
    });
  };

  const bars = (barWidth) => {
    return (
      transformedData.map((data, index) => {
        return (
          <VictoryBar
            barWidth={barWidth}
            labelComponent={<VictoryTooltip />}
            key={index}
            data={data}
          />
        );
      })
    );
  };

  // Data range of the bars, from 0: the tallest stack (or bar) and the lowest negative one
  let dataMin = 0;
  let dataMax = 0;
  if (barType === 'bar') {
    transformedData.flat().forEach(({y}) => {
      if (Number.isFinite(y)) {
        dataMin = Math.min(dataMin, y);
        dataMax = Math.max(dataMax, y);
      }
    });
  } else {
    chartData.forEach((_row, idx) => {
      let positive = 0;
      let negative = 0;
      transformedData.forEach((series) => {
        const y = series[idx] && series[idx].y;
        if (Number.isFinite(y)) {
          if (y >= 0) {
            positive += y;
          } else {
            negative += y;
          }
        }
      });
      dataMin = Math.min(dataMin, negative);
      dataMax = Math.max(dataMax, positive);
    });
  }

  // Report this chart's data range so all displayed charts share the same y-axis
  useEffect(() => {
    reportYRange(yRangeKey(indicator, selectedState, title), {min: dataMin, max: dataMax});
  }, [indicator, selectedState, title, dataMin, dataMax]);

  // Draw at the container's width, like the line chart, instead of scaling a fixed 600px chart.
  // Observe the wrapper rather than the window: opening the assistant drawer narrows it too.
  const containerRef = useRef(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const yDomain = yAxisRange && yAxisRange.max > yAxisRange.min ?
    [Math.min(0, yAxisRange.min), yAxisRange.max] : undefined;

  // Short tick values (300K, 1.2M) so they fit beside the axis, with the axis title outside them
  const compact = new Intl.NumberFormat(selectedLocale || undefined,
      {notation: 'compact', maximumSignificantDigits: 3});
  const yAxisLabel = channelConfig['yAxisLabel'] || '';

  return (
    <div className={classes.root}>
      <div className={classes.chartContainer} ref={containerRef}>
        { transformedData[0].length > 0 &&
          <VictoryChart
            domainPadding={{x: 20}}
            domain={yDomain && {y: yDomain}}
            theme={VictoryTheme.clean}
            width={width}
            height={300}
            responsive={false}
            padding={{'top': 20, 'right': 20, 'bottom': 120, 'left': yAxisLabel ? 80 : 60}}
          >
            <VictoryAxis />
            <VictoryAxis dependentAxis
              label={yAxisLabel}
              tickFormat={(t) => compact.format(t)}
              style={{axisLabel: {padding: 50}}}
            />
            {
              barType === 'bar' ?
                <VictoryGroup
                  domainPadding={{x: 20}}
                  offset={10}
                  colorScale={'qualitative'}
                >
                  { bars(9)}
                </VictoryGroup> :
                <VictoryStack>
                  { bars(20)}
                </VictoryStack>
            }
            <VictoryLegend
              itemsPerRow={3}
              x={20}
              y={220}
              borderPadding={{'top': 0, 'right': 0, 'bottom': 0, 'left': 10}}
              data={transformedData.map((s) => {
                return ({
                  name: s && s.length > 0 ? (s[0].labelOnly || '') : '',
                });
              })}
            />
          </VictoryChart>
        }
      </div>
    </div>
  );
};

StackedBarChart.propTypes = {
  classes: PropTypes.object,
  chartData: PropTypes.array.isRequired,
  channel: PropTypes.string,
  barType: PropTypes.string,
  intl: PropTypes.object,
  indicator: PropTypes.string,
  selectedState: PropTypes.string,
  title: PropTypes.string,
};

export default withStyles(styles)(injectIntl(StackedBarChart));
