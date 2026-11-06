import React, {useEffect, useMemo, useState} from 'react';
import {Typography} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {useSelector} from 'react-redux';
import axios from 'axios';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import EventLineChart from './uielements/EventLineChart';
import StackedBarChart from './uielements/StackedBarChart';
import {useIndicatorConfig} from '../hooks/useAppConfig.ts';
import {fetchTimeseries, getShapeFileVersion} from './StateDataChart';
import loader from '../image/loader.gif';

const styles = {
  title: {
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
  noDataOrLoading: {
    minHeight: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  root: {
    border: 'solid 1px lightgrey',
    margin: '0 5px 0 5px',
  },
};

const isNum = (v) => v !== null && v !== undefined && !isNaN(v);

export const hasMultipleSeries = (rows, ignoreOthers) => {
  const hasMain = _.some(rows, (d) => isNum(d.middle));
  const hasReference = _.some(rows, (d) => isNum(d.reference_middle));
  const otherKeys = ignoreOthers ? [] :
    _.uniq(_.flatMap(rows, (d) => d.others ? Object.keys(d.others) : []));
  return (hasMain ? 1 : 0) + (hasReference ? 1 : 0) + otherKeys.length > 1;
};

export const combinedTitle = (groups) => 'combined:' + groups.join('+');

export const useCombinedTimeseries = ({groups, selectedState, channel, enabled}) => {
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const indicators = useSelector((state) => state.filters.indicators);
  const dotName = selectedState || selectedCountry;
  const shapeFileVersion = getShapeFileVersion(indicators, channel);
  const [groupData, setGroupData] = useState(null);
  const [isError, setIsError] = useState(false);
  const groupsKey = groups.join('|');

  useEffect(() => {
    setGroupData(null);
    setIsError(false);
    if (!enabled || !dotName || !channel) {
      return undefined;
    }
    const abortController = new AbortController();
    Promise.all(groups.map((group) => fetchTimeseries({dotName, channel, group, shapeFileVersion,
      signal: abortController.signal})))
        .then((results) => setGroupData(_.zipObject(groups, results)))
        .catch((error) => {
          if (axios.isCancel(error)) return;
          console.error('[CombinedStateDataChart] fetch error for', groups, dotName, error);
          setIsError(true);
        });
    return () => abortController.abort();
  }, [enabled, dotName, channel, groupsKey, shapeFileVersion, selectedLocale]);

  return {groupData, isError};
};

const CombinedStateDataChart = (props) => {
  const {classes, groups, groupData, isError, selectedState, channel} = props;
  const indicatorConfig = useIndicatorConfig(channel);
  const chartType = props.chartType || _.get(indicatorConfig, 'chartType');
  const isBar = chartType == 'stackBar' || chartType == 'bar';

  const chartData = useMemo(() => {
    if (!groupData) {
      return [];
    }
    const rows = {};
    groups.forEach((group) => {
      (groupData[group] || []).forEach((d) => {
        if (!isNum(d.middle)) {
          return;
        }
        const key = d.year + '-' + (isNum(d.month) ? d.month : '');
        rows[key] = rows[key] || {year: d.year, month: d.month, others: {}};
        rows[key].others[group] = d.middle;
      });
    });
    return _.orderBy(Object.values(rows), ['year', 'month'], ['asc', 'asc']);
  }, [groupData, groups]);

  const barData = useMemo(() => chartData.map((row) => {
    return {
      year: row.year,
      month: row.month,
      middle: _.get(row.others, groups[0], null),
      others: _.fromPairs(groups.slice(1).map((group) => [group, _.get(row.others, group, null)])),
    };
  }), [chartData, groups]);

  if (isError) {
    return (
      <div className={classes.noDataOrLoading}>
        Error loading chart data...</div>);
  }

  if (!groupData) {
    return (
      <div className={classes.noDataOrLoading}>
        <img src={loader} alt={'Loading...'}/>
      </div>);
  }

  if (chartData.length === 0) {
    return (
      <div className={classes.noDataOrLoading}>
        No data available
      </div>);
  }

  const translate = (id) => props.intl.messages[id] ? props.intl.formatMessage({id}) : id;

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2" className={classes.title}>
        {groups.map(translate).join(', ')}
      </Typography>
      {isBar ?
        <StackedBarChart chartData={barData} title={combinedTitle(groups)}
          channel={translate(groups[0])}
          indicator={channel}
          barType={chartType}
          selectedState={selectedState} /> :
        <EventLineChart chartData={chartData} title={combinedTitle(groups)} channel={channel}
          selectedState={selectedState} combined />
      }
    </div>
  );
};

CombinedStateDataChart.propTypes = {
  classes: PropTypes.object,
  groups: PropTypes.array,
  groupData: PropTypes.object,
  isError: PropTypes.bool,
  selectedState: PropTypes.string,
  channel: PropTypes.string,
  chartType: PropTypes.string,
  intl: PropTypes.object,
};

export default withStyles(styles)(injectIntl(CombinedStateDataChart));
