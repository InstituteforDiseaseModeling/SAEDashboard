/* eslint-disable max-len */
import React, {useEffect} from 'react';
import Paper from '@mui/material/Paper';
import withStyles from '@mui/styles/withStyles';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeSelectedIndicator, changeSelectedComparisonIndicator,
  changeSelectedMapTheme, changeSelectedComparisonMapTheme,
  changeSelectedState, changeSelectedComparisonState,
  changeIsAdm3,
  changeSelectedSubgroup,
  changeSelectedComparisonSubgroup,
} from '../redux/actions/filters';
import Filters from './MapPanelFilter';
import MapPanelMap from './MapPanelMap';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';


const styles = {
  root: {
    marginBottom: '1em',
    borderRadius: 0,
    margin: 5,
    height: 'calc(100% - 10px)',
    display: 'flex',
    flexDirection: 'column',
  },
  comparisonMapBar: {
    background: '#2196f3',
  },
};

const MapPanel = (props) => {
  const {classes, primary} = props;
  const dispatch = useDispatch();
  const indicators = useSelector((state) => state.filters.indicators);
  const selectedIndicator = useSelector((state) => state.filters.selectedIndicator);
  const selectedSubgroup = useSelector((state) => state.filters.selectedSubgroup);
  const selectedComparisonIndicator = useSelector(
      (state) => state.filters.selectedComparisonIndicator);
  const selectedSubgroupComparison = useSelector((state) => state.filters.selectedComparisonSubgroup);
  const subgroups = _.find(indicators, {id: selectedIndicator})?.subgroups || [];
  const subgroupsComparison = _.find(indicators, {id: selectedComparisonIndicator})?.subgroups || [];

  const pickDefaultSubgroupFrom = (subs) => {
    if (!subs || subs.length === 0) return null;
    const real = subs.filter((s) => s !== 'all');
    return real.length > 0 ? real[0] : 'all';
  };
  const pickDefaultSubgroup = (indicatorId) => {
    const subs = _.find(indicators, {id: indicatorId})?.subgroups || [];
    return pickDefaultSubgroupFrom(subs);
  };
  const selectedMapThemeRedux = useSelector((state) => state.filters.selectedMapTheme);
  const selectedComparisonMapThemeRedux = useSelector((state) =>
    state.filters.selectedComparisonMapTheme);

  const selectedYear = useSelector((state) => state.filters.selectedYear);
  const currentYear = useSelector((state) => state.filters.currentYear);
  const isAdm3 = useSelector((state) => state.filters.isAdm3);

  const changeSelectedIndicatorHandler = (indicator) => {
    dispatch(changeSelectedIndicator(indicator));
    const sg = pickDefaultSubgroup(indicator);
    if (sg !== null) dispatch(changeSelectedSubgroup(sg));
  };

  const changeIsAdm3Handler = (isAdm3) => {
    dispatch(changeIsAdm3(isAdm3));
  };

  const changeSelectedComparisonIndicatorHandler = (indicator) => {
    dispatch(changeSelectedComparisonIndicator(indicator));
    const sg = pickDefaultSubgroup(indicator);
    if (sg !== null) dispatch(changeSelectedComparisonSubgroup(sg));
  };

  const changeSelectedMapThemeRedux = (mapTheme) => {
    dispatch(changeSelectedMapTheme(mapTheme));
  };

  const changeSelectedComparisonMapThemeRedux = (mapTheme) => {
    dispatch(changeSelectedComparisonMapTheme(mapTheme));
  };

  const setSelectedState = (state) => {
    if (primary) {
      dispatch(changeSelectedState(state));
    } else {
      dispatch(changeSelectedComparisonState(state));
    }
  };

  const subgroupsKey = subgroups.join(',');
  const subgroupsComparisonKey = subgroupsComparison.join(',');

  useEffect(() => {
    if (!primary || subgroups.length === 0) return;
    if (selectedSubgroup && subgroups.includes(selectedSubgroup)) return;
    const def = pickDefaultSubgroupFrom(subgroups);
    if (def !== null) dispatch(changeSelectedSubgroup(def));
  }, [primary, subgroupsKey, selectedIndicator, selectedSubgroup, isAdm3]);

  useEffect(() => {
    if (primary || subgroupsComparison.length === 0) return;
    if (selectedSubgroupComparison && subgroupsComparison.includes(selectedSubgroupComparison)) return;
    const def = pickDefaultSubgroupFrom(subgroupsComparison);
    if (def !== null) dispatch(changeSelectedComparisonSubgroup(def));
  }, [primary, subgroupsComparisonKey, selectedComparisonIndicator, selectedSubgroupComparison, isAdm3]);

  const changeSubgroup = (primary, subgroup) => {
    if (primary) {
      dispatch(changeSelectedSubgroup(subgroup));
    } else {
      dispatch(changeSelectedComparisonSubgroup(subgroup));
    }
  };


  return (
    <Paper className={classes.root}>
      <Filters
        title={primary ?
          <FormattedMessage id='main_map' /> : <FormattedMessage id='comparison_map' />}
        changeSubgroup={changeSubgroup}
        changeIndicator={primary ? changeSelectedIndicatorHandler :
          changeSelectedComparisonIndicatorHandler}
        changeIsAdm3={changeIsAdm3Handler}
        changeMapTheme={changeSelectedMapThemeRedux}
        changeComparisonMapTheme={changeSelectedComparisonMapThemeRedux}
        selectedSubgroup={primary ? selectedSubgroup : selectedSubgroupComparison}
        selectedIndicator={primary ? selectedIndicator : selectedComparisonIndicator}
        selectedMapTheme={selectedMapThemeRedux}
        selectedComparisonMapTheme={selectedComparisonMapThemeRedux}
        parentClasses={primary ? {} : classes}
        primary={primary} />
      <MapPanelMap changeSelectedState={setSelectedState}
        subgroup={primary ? selectedSubgroup: selectedSubgroupComparison}
        indicator={primary ? selectedIndicator: selectedComparisonIndicator}
        key={selectedIndicator+selectedComparisonIndicator+selectedSubgroup+
          + selectedSubgroupComparison+
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
