import React, {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import withStyles from '@mui/styles/withStyles';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeSelectedIndicator, changeSelectedComparisonIndicator,
  changeSelectedMapTheme,
  changeSelectedState,
} from '../redux/actions/filters';
import Filters from './MapPanelFilter';
import MapPanelMap from './MapPanelMap';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import config from '../app_config.json';


const styles = {
  root: {
    marginBottom: '1em',
    padding: 5,
    margin: 5,
  },
  comparisonMapBar: {
    background: '#2196f3',
  },
};

const MapPanel = (props) => {
  const {classes, primary} = props;
  const dispatch = useDispatch();
  const subgroups = useSelector((state) => state.filters.mapSubgroups);
  const indicators = useSelector((state) => state.filters.indicators);

  const selectedIndicator = useSelector((state) => state.filters.selectedIndicator);
  const selectedComparisonIndicator = useSelector(
      (state) => state.filters.selectedComparisonIndicator);
  const selectedMapThemeRedux = useSelector((state) => state.filters.selectedMapTheme);
  const selectedYear = useSelector((state) => state.filters.selectedYear);
  const currentYear = useSelector((state) => state.filters.currentYear);
  const isAdm3 = useSelector((state) => state.filters.isAdm3);

  const [selectedSubgroup, changeSubgroup] = useState();

  // Handle changing indicator for main map.
  const changeSelectedIndicatorHandler = (indicator) => {
    dispatch(changeSelectedIndicator(indicator));
  };

  // Handle changing indicator for main map.
  const changeSelectedComparisonIndicatorHandler = (indicator) => {
    dispatch(changeSelectedComparisonIndicator(indicator));
  };

  // Handle changing the map theme color.
  const changeSelectedMapThemeRedux = (mapTheme) => {
    dispatch(changeSelectedMapTheme(mapTheme));
  };

  // Handle changing the selected state.
  const setSelectedState = (state) => {
    if (primary) {
      dispatch(changeSelectedState(state));
    }
  };


  // By default assign the first element
  if (subgroups.length !== 0 && !_.find(subgroups, {id: selectedSubgroup})) {
    // try to find the next indicator/subgroup when there is only "All women" subgroup
    if (subgroups[0].id === 'all' && indicators.length > 1 && !primary) {
      changeSelectedComparisonIndicator(config.defaultComparisonIndicator);
    }
    const allSubgroup = _.find(subgroups, {id: 'all'});

    changeSubgroup(primary && allSubgroup ? 'all' : subgroups[0].id);
  }

  useEffect(()=>{
    changeSubgroup(null);
  }, [indicators.length, selectedIndicator]);

  useEffect(()=>{
    changeSubgroup(null);
  }, [isAdm3]);

  return (
    <Paper className={classes.root}>
      <Filters
        title={primary ?
          <FormattedMessage id='main_map' /> : <FormattedMessage id='comparison_map' />}
        changeSubgroup={changeSubgroup}
        changeIndicator={primary ? changeSelectedIndicatorHandler :
          changeSelectedComparisonIndicatorHandler}
        changeMapTheme={changeSelectedMapThemeRedux}
        selectedSubgroup={selectedSubgroup}
        selectedIndicator={primary ? selectedIndicator : selectedComparisonIndicator}
        selectedMapTheme={selectedMapThemeRedux}
        parentClasses={primary ? {} : classes}
        primary={primary} />
      <MapPanelMap changeSelectedState={setSelectedState}
        subgroup={selectedSubgroup} indicator={primary ? selectedIndicator :
          selectedComparisonIndicator}
        key={selectedIndicator+selectedComparisonIndicator +
          primary ? currentYear : selectedYear}
        primary={primary}/>
    </Paper>
  );
};

MapPanel.propTypes = {
  classes: PropTypes.any,
  primary: PropTypes.bool,
};

export default withStyles(styles)(MapPanel);

