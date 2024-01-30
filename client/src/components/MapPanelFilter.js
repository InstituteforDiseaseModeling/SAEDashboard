import {Typography} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import withStyles from '@mui/styles/withStyles';
import IndicatorFilter from './filterelements/IndicatorsFilter';
import MapLegendMax from './filterelements/MapLegendMax';
import MapSubgroupsFilter from './filterelements/MapSubgroupsFilter';
import MapTheme from './filterelements/MapTheme';
import PropTypes from 'prop-types';
import LegendPicker from './filterelements/LegendPicker';
import YearMonthPicker from './filterelements/YearMonthPicker';
import DiffMapPicker from './filterelements/DiffMapPicker';
import LegendSyncPicker from './filterelements/LegendSyncPicker';

const styles = ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  MapTitle: {
    fontSize: 15,
  },
  mapBar: {
    // marginBottom: 12,
    top: 5,
    height: 58,
    backgroundColor: '#256baf',
  },
  toolbar: {
    top: 5,
  },
});

const Filters = (props) => {
  const {parentClasses, classes, primary, title, changeIndicator, changeSubgroup, changeMapTheme,
    selectedIndicator, selectedSubgroup, selectedMapTheme} = props;
  return (
    <AppBar position="static" className={primary ? `${classes.mapBar}` :
      `${classes.mapBar} ${parentClasses.comparisonMapBar}`}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <Typography variant="h6" color="inherit" className={classes.MapTitle}>
          {title}
        </Typography>
        <div className={classes.grow}/>
        {primary ? <MapLegendMax/> : null} &nbsp;&nbsp;&nbsp;
        {primary ? <LegendPicker/> : null} &nbsp;&nbsp;&nbsp;
        {primary ? <MapTheme changeMapTheme={changeMapTheme}
          selectedMapTheme={selectedMapTheme}
          indicator={selectedIndicator} /> : null} &nbsp;&nbsp;&nbsp;
        {!primary ? <LegendSyncPicker/> : null}
        {!primary ? <DiffMapPicker/> : null}
        {!primary ? <YearMonthPicker/> : null}
        <IndicatorFilter changeIndicator={changeIndicator}
          selectedIndicator={selectedIndicator} primary={primary} key={primary}/> &nbsp;&nbsp;&nbsp;
        <MapSubgroupsFilter changeSubgroup={changeSubgroup} selectedSubgroup={selectedSubgroup}/>

      </Toolbar>
    </AppBar>
  );
};

Filters.propTypes = {
  changeIndicator: PropTypes.func,
  changeMapTheme: PropTypes.func,
  changeSubgroup: PropTypes.func,
  classes: PropTypes.any,
  parentClasses: PropTypes.any,
  primary: PropTypes.bool,
  selectedIndicator: PropTypes.string,
  selectedMapTheme: PropTypes.string,
  selectedSubgroup: PropTypes.string,
  title: PropTypes.string,
};

export default withStyles(styles)(Filters);
