/* eslint-disable no-unused-vars */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {Alert, Grid, Typography} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import StateDataChart from './StateDataChart';
import ChartSubgroupsFilter from './filterelements/ChartSubgroupsFilter';
import CombinedStateDataChart, {combinedTitle, hasMultipleSeries, useCombinedTimeseries}
  from './CombinedStateDataChart';
import {useIndicatorConfig} from '../hooks/useAppConfig.ts';
import * as _ from 'lodash';
import Paper from '@mui/material/Paper';
import {Toolbar, AppBar, Link} from '@mui/material';
import {ChartContext, yRangeKey} from './context/chartContext';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

const styles = {
  title: {
    textAlign: 'center',
    width: '100%',
    marginTop: 5,
    marginLeft: 25,
    fontSize: 15,
  },
  chartArea: {
    margin: '-5px 5px 0px 5px',
    paddingBottom: 5,
    minHeight: 478,
  },
  toggles: {
    textAlign: 'center',
    height: '100%',
    width: 'inherit',
    margin: '10px',
  },
  grow: {
    flexGrow: 1,
  },
  chartBar: {
    marginBottom: 5,
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 5,
    marginRight: -15,
    width: 80,
  },
  link: {
    color: 'white',
    textAlign: 'right',
    cursor: 'pointer',
  },
  combineWarning: {
    margin: '0 10px 10px 10px',
  },
};

const StateData = (props) => {
  const {classes, selectedState, indicators, channel, sharedYAxisRange, onYAxisRangeChange,
    syncYAxis, onSyncYAxisChange} = props;
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const displayName = selectedState || (selectedCountry ? selectedCountry.split(':').pop() : '');

  const [subgroups, setSubgroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [combineGroups, setCombineGroups] = useState(false);
  const [chartType, setChartType] = useState('');
  const intl = useIntl();
  const ignoreOthers = _.get(useIndicatorConfig(channel), 'ignoreOthers', false);

  const combineRequested = combineGroups && selectedGroups.length > 1;
  const {groupData, isError: combinedError} = useCombinedTimeseries({groups: selectedGroups,
    selectedState, channel, enabled: combineRequested});
  const multiSeriesGroups = combineRequested && groupData ?
    selectedGroups.filter((group) => hasMultipleSeries(groupData[group], ignoreOthers)) : [];
  const showCombined = combineRequested && multiSeriesGroups.length === 0;

  const [yRanges, setYRanges] = useState({});

  const reportYRange = useCallback((key, range) => {
    setYRanges((prev) => ({...prev, [key]: range}));
  }, []);

  const yAxisRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    const charts = showCombined ? [combinedTitle(selectedGroups)] : selectedGroups;
    charts.forEach((group) => {
      const range = yRanges[yRangeKey(channel, selectedState, group)];
      if (range) {
        min = Math.min(min, range.min);
        max = Math.max(max, range.max);
      }
    });
    return min <= max ? {min, max} : null;
  }, [yRanges, selectedGroups, channel, selectedState, showCombined]);

  useEffect(() => {
    if (onYAxisRangeChange) {
      onYAxisRangeChange(yAxisRange);
    }
  }, [yAxisRange, onYAxisRangeChange]);

  const effectiveYAxisRange = sharedYAxisRange || yAxisRange;

  const contextValue = useMemo(() => ({yAxisRange: effectiveYAxisRange, reportYRange}),
      [effectiveYAxisRange, reportYRange]);
  const indObj = _.find(indicators, {'id': channel});

  const showAll = () => {
    setSelectedGroups(indObj.subgroups);
  };

  const hideAll = () => {
    setSelectedGroups([]);
  };

  useEffect(() => {
    const indObj = _.find(indicators, {'id': channel});
    console.log('[StateData] effect:', {
      selectedState, channel, hasIndObj: !!indObj, subgroupCount: indObj?.subgroups?.length,
    });

    if (indObj) {
      setSubgroups(indObj.subgroups);
      setSelectedGroups(indObj.subgroups);
    }
  }, [selectedState, indicators, channel]);

  const toggleGroup = (toggleGroup) => {
    const index = _.indexOf(selectedGroups, toggleGroup);

    if (index !== -1) {
      setSelectedGroups([...selectedGroups.filter((group) => group !== toggleGroup)]);
    } else {
      const newGroups = [...selectedGroups, toggleGroup];
      const newSelectedGroups = subgroups.filter((group) => newGroups.includes(group));
      setSelectedGroups(newSelectedGroups.map( (group)=>group));
    }
  };

  if (subgroups.length === 0) {
    return null;
  }


  return (
    <Paper className={classes.chartArea}>
      <AppBar position="static" >
        <Toolbar variant="dense" className={classes.chartBar}>
          <Typography variant="h6" className={classes.title}>
            {displayName} ({indObj ? indObj['text'] : '' })
          </Typography>
          <div className={classes.grow} key={1}/>
          <div className={classes.linkContainer} key={2}>
            <Link className={classes.link} onClick={showAll}>
              <Typography variant="subtitle2">
                <FormattedMessage id="show_all"/>
              </Typography>
            </Link>
            <Link className={classes.link} onClick={hideAll}>
              <Typography variant="subtitle2">
                <FormattedMessage id="hide_all"/>
              </Typography>
            </Link>
          </div>
        </Toolbar>
      </AppBar>

      <ChartContext.Provider value={contextValue}>
        <div className={classes.toggles}>
          <ChartSubgroupsFilter groups={subgroups}
            selectedGroups={selectedGroups}
            toggleGroup={toggleGroup}
            combineGroups={combineGroups}
            onCombineGroupsChange={setCombineGroups}
            syncYAxis={syncYAxis}
            onSyncYAxisChange={onSyncYAxisChange}
            chartType={chartType}
            onChartTypeChange={setChartType}/>
        </div>
        {multiSeriesGroups.length > 0 &&
          <Alert severity="warning" className={classes.combineWarning}>
            <FormattedMessage id="combine_subgroups_multi_series_warning" values={{
              groups: multiSeriesGroups.map((group) =>
                intl.messages[group] ? intl.formatMessage({id: group}) : group).join(', '),
            }}/>
          </Alert>
        }
        <Grid container spacing={1} >
          {showCombined ?
            <Grid item xs={12} md={12}>
              <CombinedStateDataChart
                groups={selectedGroups}
                groupData={groupData}
                isError={combinedError}
                selectedState={selectedState}
                channel={channel}
                chartType={chartType}
              />
            </Grid> :
          selectedGroups.map((group) => {
            return (
              <Grid item xs={12} md={12} key={group} >
                <StateDataChart
                  group={group}
                  groupName={group}
                  selectedState={selectedState}
                  channel={channel}
                  chartType={chartType}
                  key={channel+selectedState}
                />
              </Grid>
            );
          })}
        </Grid>
      </ChartContext.Provider>
    </Paper>
  );
};

StateData.propTypes = {
  classes: PropTypes.object,
  selectedState: PropTypes.string,
  indicators: PropTypes.array,
  channel: PropTypes.string,
  sharedYAxisRange: PropTypes.shape({min: PropTypes.number, max: PropTypes.number}),
  onYAxisRangeChange: PropTypes.func,
  syncYAxis: PropTypes.bool,
  onSyncYAxisChange: PropTypes.func,
};

export default withStyles(styles)(StateData);
