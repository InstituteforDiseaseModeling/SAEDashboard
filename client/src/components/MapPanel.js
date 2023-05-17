import React, {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import withStyles from '@mui/styles/withStyles';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeSelectedIndicator,
  changeSelectedMapTheme,
  changeSelectedState,
} from '../redux/actions/filters';
import Filters from './MapPanelFilter';
import MapPanelMap from './MapPanelMap';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

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

  const selectedIndicatorRedux = useSelector((state) => state.filters.selectedIndicator);
  const selectedMapThemeRedux = useSelector((state) => state.filters.selectedMapTheme);
  const isAdm3 = useSelector((state) => state.filters.isAdm3);

  const [selectedSubgroup, changeSubgroup] = useState();
  const [selectedIndicator, changeIndicator] = useState();

  // Handle changing indicator for main map.
  const changeSelectedIndicatorRedux = (indicator) => {
    dispatch(changeSelectedIndicator(indicator, props.primary));
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

  if (indicators.length !== 0 && !selectedIndicator) {
    changeIndicator(indicators[0].id);
  }

  // By default assign the first element
  if (subgroups.length !== 0 && !_.find(subgroups, {id: selectedSubgroup})) {
    // try to find the next indicator/subgroup when there is only "All women" subgroup
    if (subgroups[0].id === 'all' && indicators.length > 1 && !primary) {
      changeIndicator(indicators[1].id);
    }
    const allSubgroup = _.find(subgroups, {id: 'all'});

    changeSubgroup(primary && allSubgroup ? 'all' : subgroups[0].id);
  }

  useEffect(()=>{
    changeSubgroup(null);
  }, [indicators.length]);

  useEffect(()=>{
    changeSubgroup(null);
    changeIndicator(null);
  }, [isAdm3]);

  return (
    <Paper className={classes.root}>
      <Filters title={primary ? 'Main Map' : 'Comparison Map'}
        changeSubgroup={changeSubgroup}
        changeIndicator={primary ? changeSelectedIndicatorRedux : changeIndicator}
        changeMapTheme={changeSelectedMapThemeRedux}
        selectedSubgroup={selectedSubgroup}
        selectedIndicator={primary ? selectedIndicatorRedux : selectedIndicator}
        selectedMapTheme={selectedMapThemeRedux}
        parentClasses={primary ? {} : classes}
        primary={primary}/>
      <MapPanelMap changeSelectedState={setSelectedState}
        subgroup={selectedSubgroup} indicator={primary ? selectedIndicatorRedux : selectedIndicator}
        primary={primary}/>
    </Paper>
  );
};

MapPanel.propTypes = {
  classes: PropTypes.any,
  primary: PropTypes.bool,
};

export default withStyles(styles)(MapPanel);

