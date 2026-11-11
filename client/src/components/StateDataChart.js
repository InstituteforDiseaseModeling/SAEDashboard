/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
import React, {useEffect, useState} from 'react';
import {Typography} from '@mui/material';
import EventLineChart from './uielements/EventLineChart';
import axios from 'axios';
import withStyles from '@mui/styles/withStyles';
import loader from '../image/loader.gif';
import {showError} from '../redux/actions/messaging';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import config from '../app_config.json';
import {useIndicatorConfig} from '../hooks/useAppConfig.ts';
import StackedBarChart from './uielements/StackedBarChart';

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

const API_URL = {baseURL: process.env.API_BASE_URL || '/api'};

export const fetchTimeseries = async ({dotName, channel, group, shapeFileVersion, signal}) => {
  const http = axios.create(API_URL);
  const url = '/timeseries?dot_name=' + dotName + '&channel=' + channel + '&subgroup=' +
      group + '&shape_version=' + shapeFileVersion;
  console.log('[StateDataChart] fetching:', http.defaults.baseURL + url);
  let result;
  try {
    result = await http(url, {signal});
  } catch (error) {
    const status = error.response && error.response.status;
    if (status === 400 || status === 404) {
      return [];
    }
    throw error;
  }
  console.log('[StateDataChart] got', result.data.length, 'points for', group, dotName);
  for (const item of result.data) {
    item.month = parseInt(item.month);
  }
  if (channel == 'intervention_mix_pecadom') {
    result.data = result.data.map((annualData) => {
      const filteredData = {};
      for (const key in annualData.others) {
        if (Object.hasOwn(annualData.others, key)) {
          if (annualData.others[key] == 1) {
            filteredData[key] = 1;
          };
        };
      };
      annualData.others = filteredData;
      return annualData;
    });
  }
  return result.data;
};

export const getShapeFileVersion = (indicators, channel) =>
  indicators?.find((i) => i.id === channel)?.version ??
    config.shapefileVersion[channel] ?? 1;

const StateDataChart = (props) => {
  const {classes, group, groupName, selectedState, channel} = props;
  const channelConfig = useIndicatorConfig(channel) || {};
  const chartType = props.chartType || channelConfig.chartType;
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const dotName = selectedState || selectedCountry;
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const indicators = useSelector((state) => state.filters.indicators);

  const shapeFileVersion = getShapeFileVersion(indicators, channel);

  const dispatch = useDispatch();
  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      setIsError(false);
      try {
        setData(await fetchTimeseries({dotName, channel, group, shapeFileVersion,
          signal: abortController.signal}));
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('[StateDataChart] fetch error for', group, dotName, error);
        setIsError(true);
      }
    };

    if (dotName && group && channel) {
      fetchData();
    }
    return () => abortController.abort();
  }, [dotName, channel, group, selectedLocale]);

  if (!data && !isError && dotName) {
    return (
      <div className={classes.noDataOrLoading}>
        <img src={loader} alt={'Loading...'}/>
      </div>);
  };

  if (!dotName && !isError) {
    return (
      <div className={classes.noDataOrLoading}>
        <FormattedMessage id='SelectStateOrDistrict'/>
      </div>);
  };

  if (Array.isArray(data) && data.length === 0) {
    return (
      <div className={classes.noDataOrLoading}>
        No data available
      </div>);
  };

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2" className={classes.title}>
        <FormattedMessage id={groupName}/>
      </Typography>

      {
        isError ?
          <div className={classes.noDataOrLoading}>
            Error loading chart data...</div> :
          (
            (chartType == 'stackBar' || chartType == 'bar') ?
            <StackedBarChart chartData={data} title={group}
              channel={channelConfig.mainSpeciesName}
              indicator={channel}
              barType={chartType}
              selectedState={selectedState} /> :
            <EventLineChart chartData={data} title={group} channel={channel}
              selectedState={selectedState} />
          )
      }
    </div>
  );
};

StateDataChart.propTypes = {
  classes: PropTypes.object,
  group: PropTypes.string,
  groupName: PropTypes.string,
  selectedState: PropTypes.string,
  channel: PropTypes.string,
  chartType: PropTypes.string,
};

export default withStyles(styles)(StateDataChart);
