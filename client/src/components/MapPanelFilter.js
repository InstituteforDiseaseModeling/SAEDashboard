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
    marginBottom: 10,
    backgroundColor: '#256baf',
  },
});

const Filters = (props) => {
  const {parentClasses, classes, primary, title, changeIndicator, changeSubgroup, changeMapTheme,
    selectedIndicator, selectedSubgroup, selectedMapTheme} = props;
  return (
    <AppBar position="static" className={primary ? `${classes.mapBar}` :
      `${classes.mapBar} ${parentClasses.comparisonMapBar}`}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" className={classes.MapTitle}>
          {title}
        </Typography>
        <div className={classes.grow}/>
        {primary ? <MapLegendMax/> : null} &nbsp;&nbsp;&nbsp;
        {primary ? <MapTheme changeMapTheme={changeMapTheme}
          selectedMapTheme={selectedMapTheme}
          indicator={selectedIndicator} /> : null} &nbsp;&nbsp;&nbsp;
        <IndicatorFilter changeIndicator={changeIndicator}
          selectedIndicator={selectedIndicator}/> &nbsp;&nbsp;&nbsp;
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
