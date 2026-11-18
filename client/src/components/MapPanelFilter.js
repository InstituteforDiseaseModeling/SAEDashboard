import {Typography, IconButton, Popover, Tooltip} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Toolbar from '@mui/material/Toolbar';
import React, {useRef, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import withStyles from '@mui/styles/withStyles';
import IndicatorFilter from './filterelements/IndicatorsFilter';
import MapLegendMax from './filterelements/MapLegendMax';
import MapSubgroupsFilter from './filterelements/MapSubgroupsFilter';
import MapTheme from './filterelements/MapTheme';
import PropTypes from 'prop-types';
import YearMonthPicker from './filterelements/YearMonthPicker';
import DiffMapPicker from './filterelements/DiffMapPicker';
import LegendSyncPicker from './filterelements/LegendSyncPicker';
import {useSyncedFilterBarHeight} from './provider/filterBarHeightProvider';

const ACCENT_GOLD = '#EBCB00';
const TOOLBAR_MIN_HEIGHT = 72;
const TOOLBAR_PADDING_Y = 10;

const styles = ({
  root: {
    width: '100%',
  },
  mapBar: {
    top: 5,
    minHeight: 72,
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
    'minHeight': TOOLBAR_MIN_HEIGHT,
    // MUI Toolbar sets its own min-height at >=600px; keep ours there too.
    '@media (min-width: 600px)': {
      minHeight: TOOLBAR_MIN_HEIGHT,
    },
    'paddingTop': TOOLBAR_PADDING_Y,
    'paddingBottom': TOOLBAR_PADDING_Y,
    'paddingLeft': 18,
    'paddingRight': 18,
    'gap': 22,
  },
  // Filters sit in their own column right of the title. They wrap onto extra
  // rows (right-aligned) when space runs out, never underneath the title.
  filters: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    columnGap: 22,
    rowGap: 12,
  },
  settingsButton: {
    'flexShrink': 0,
    // Other controls have a label above their box; align to the bottom to match the boxes.
    'alignSelf': 'flex-end',
    'color': 'rgba(245, 243, 237, 0.75)',
    'border': '1px solid rgba(245, 243, 237, 0.25)',
    'borderRadius': 6,
    'padding': 5,
    '&:hover': {
      color: '#F5F3ED',
      borderColor: 'rgba(245, 243, 237, 0.5)',
      backgroundColor: 'rgba(245, 243, 237, 0.07)',
    },
  },
  settingsButtonActive: {
    color: `${ACCENT_GOLD} !important`,
    borderColor: `${ACCENT_GOLD} !important`,
  },
  // Dark panel so the toolbar-styled controls (light text) read the same as in the bar.
  settingsPaper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '16px 18px',
    minWidth: 200,
    marginTop: 6,
    backgroundColor: '#313A44',
    color: '#F5F3ED',
    borderRadius: 8,
    border: '1px solid rgba(245, 243, 237, 0.14)',
    boxShadow: '0 10px 28px rgba(49, 58, 68, 0.35)',
  },
  titleBlock: {
    flexShrink: 0,
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
    flexShrink: 0,
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

  // Match the main and comparison bars: both grow to the taller one's filter height.
  const filtersRef = useRef(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const syncedFiltersHeight = useSyncedFilterBarHeight(
      primary ? 'main' : 'comparison', filtersRef);
  const toolbarMinHeight = Math.max(
      TOOLBAR_MIN_HEIGHT, syncedFiltersHeight + 2 * TOOLBAR_PADDING_Y);

  const mapTheme = (
    <MapTheme primary={primary} changeMapTheme={changeMapTheme}
      changeComparisonMapTheme={changeComparisonMapTheme}
      selectedComparisonMapTheme={selectedComparisonMapTheme}
      selectedMapTheme={selectedMapTheme}
      indicator={selectedIndicator} />
  );

  return (
    <AppBar position="static" className={primary ? `${classes.mapBar}` :
      `${classes.mapBar} ${parentClasses.comparisonMapBar}`}>
      <Toolbar variant="dense" className={classes.toolbar} style={{minHeight: toolbarMinHeight}}>
        <div className={classes.titleBlock}>
          <span className={`${classes.titleDot} ${primary ? '' : classes.comparisonTitleDot}`} />
          <Typography variant="h6" color="inherit" className={classes.mapTitle}>
            {title}
          </Typography>
        </div>

        <div ref={filtersRef} className={classes.filters}>
          {primary ? <MapLegendMax/> : null}
          {/* {primary ? <span className={classes.divider} /> : null} */}
          {primary ? mapTheme : null}

          {!primary ? <YearMonthPicker/> : null}

          {/* <span className={classes.divider} /> */}

          <IndicatorFilter changeIndicator={changeIndicator}
            changeIsAdm3={changeIsAdm3}
            selectedIndicator={selectedIndicator} primary={primary} key={primary}/>
          <MapSubgroupsFilter changeSubgroup={changeSubgroup}
            selectedIndicator={selectedIndicator}
            primary={primary}
            selectedSubgroup={selectedSubgroup}/>

          {/* Comparison map: theme, legend sync and difference live behind a gear button */}
          {!primary ? (
            <>
              <Tooltip title="Additional map settings" arrow>
                <IconButton
                  size="small"
                  aria-label="Additional map settings"
                  aria-haspopup="true"
                  aria-expanded={Boolean(settingsAnchor)}
                  className={`${classes.settingsButton} ${
                    settingsAnchor ? classes.settingsButtonActive : ''}`}
                  onClick={(e) => setSettingsAnchor(e.currentTarget)}>
                  <SettingsOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {/* keepMounted: MapTheme sets the comparison theme on indicator change,
                  so it must stay mounted while the popover is closed. */}
              <Popover
                keepMounted
                open={Boolean(settingsAnchor)}
                anchorEl={settingsAnchor}
                onClose={() => setSettingsAnchor(null)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{className: classes.settingsPaper}}>
                {mapTheme}
                <LegendSyncPicker/>
                <DiffMapPicker/>
              </Popover>
            </>
          ) : null}
        </div>
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
  title: PropTypes.node,
};

export default withStyles(styles)(Filters);
