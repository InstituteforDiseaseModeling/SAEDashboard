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

const ACCENT_GOLD = '#EBCB00';

const styles = ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  mapBar: {
    top: 5,
    minHeight: 52,
    backgroundColor: '#313A44',
    backgroundImage: 'linear-gradient(180deg, #313A44 0%, #313A44 100%)',
    boxShadow: '0 2px 8px rgba(49, 58, 68, 0.25)',
    borderBottom: `2px solid ${ACCENT_GOLD}`,
  },
  comparisonMapBar: {
    backgroundColor: '#313A44',
    backgroundImage: 'linear-gradient(180deg, #313A44 0%, #313A44 100%)',
    borderBottom: '2px solid rgba(255, 255, 255, 0.18)',
  },
  toolbar: {
    minHeight: 52,
    paddingLeft: 18,
    paddingRight: 18,
    gap: 22,
  },
  titleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: ACCENT_GOLD,
    boxShadow: '0 0 0 3px rgba(235, 203, 0, 0.18)',
  },
  comparisonTitleDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.18)',
  },
  mapTitle: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#F5F3ED',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    margin: '8px 0',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
});

const Filters = (props) => {
  const {parentClasses, classes, primary, title, changeIndicator, changeIsAdm3,
    changeSubgroup, changeMapTheme,
    changeComparisonMapTheme, selectedComparisonMapTheme,
    selectedIndicator, selectedSubgroup, selectedMapTheme} = props;
  return (
    <AppBar position="static" className={primary ? `${classes.mapBar}` :
      `${classes.mapBar} ${parentClasses.comparisonMapBar}`}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <div className={classes.titleBlock}>
          <span className={`${classes.titleDot} ${primary ? '' : classes.comparisonTitleDot}`} />
          <Typography variant="h6" color="inherit" className={classes.mapTitle}>
            {title}
          </Typography>
        </div>

        <div className={classes.grow}/>

        {primary ? <MapLegendMax/> : null}
        {primary ? <span className={classes.divider} /> : null}

        <MapTheme primary={primary} changeMapTheme={changeMapTheme}
          changeComparisonMapTheme={changeComparisonMapTheme}
          selectedComparisonMapTheme={selectedComparisonMapTheme}
          selectedMapTheme={selectedMapTheme}
          indicator={selectedIndicator} />

        {!primary ? <span className={classes.divider} /> : null}
        {!primary ? <LegendSyncPicker/> : null}
        {!primary ? <DiffMapPicker/> : null}
        {!primary ? <YearMonthPicker/> : null}

        <span className={classes.divider} />

        <IndicatorFilter changeIndicator={changeIndicator}
          changeIsAdm3={changeIsAdm3}
          selectedIndicator={selectedIndicator} primary={primary} key={primary}/>
        <MapSubgroupsFilter changeSubgroup={changeSubgroup}
          selectedIndicator={selectedIndicator}
          primary={primary}
          selectedSubgroup={selectedSubgroup}/>

      </Toolbar>
    </AppBar>
  );
};

Filters.propTypes = {
  changeIndicator: PropTypes.func,
  changeIsAdm3: PropTypes.func,
  changeMapTheme: PropTypes.func,
  changeComparisonMapTheme: PropTypes.func,
  changeSubgroup: PropTypes.func,
  classes: PropTypes.any,
  parentClasses: PropTypes.any,
  primary: PropTypes.bool,
  selectedIndicator: PropTypes.string,
  selectedMapTheme: PropTypes.string,
  selectedComparisonMapTheme: PropTypes.string,
  selectedSubgroup: PropTypes.string,
  title: PropTypes.string,
};

export default withStyles(styles)(Filters);
