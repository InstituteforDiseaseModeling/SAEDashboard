
/* eslint-disable no-unused-vars */
import {React, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import {Grid, Button} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {fetchGeoJsonData, fetchLayerData, fetchEventData} from '../redux/actions/dashboard';
import MapPanel from '../components/MapPanel';
import YearFilter from '../components/filterelements/YearFilter';
import MonthFilter from '../components/filterelements/MonthFilter';
import CountryFilter from '../components/filterelements/CountryFilter';
import StateData from '../components/StateData';
import {fetchCountryData, fetchIndicatorData, fetchMapSubgroupData} from '../redux/actions/filters';
import {MapContext} from '../components/context/mapContext';
import ComparisonMapProvider from '../components/provider/comparisonMapProvider';
import appConfig from '../app_config.json';

const styles = {
  content2: {
    flexGrow: 1,
    minWidth: '48rem',
    margin: '0 auto',
    padding: 10,
  },
  filters: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
  },
  comparisonBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  mapsResizable: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    paddingTop: 5,
    paddingBottom: 13,
    marginTop: 5,
  },
  mapsResizer: {
    'position': 'absolute',
    'left': 0,
    'bottom': 0,
    'marginTop': 10,
    'marginBottom': 15,
    'width': '100%',
    'height': 6,
    'cursor': 'row-resize',
    'zIndex': 1001,
    'backgroundColor': 'transparent',
    'transition': 'background-color 0.15s',
    '&:hover': {
      backgroundColor: 'rgba(49, 58, 68, 0.25)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 28,
      height: 10,
      boxSizing: 'border-box',
      border: '1.5px solid #8a8a8a',
      borderRadius: 5,
      backgroundColor: '#fff',
    },
  },
  mapsRow: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  comparisonButton: {
    'fontFamily': '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    'fontSize': 11,
    'fontWeight': 600,
    'letterSpacing': '0.16em',
    'textTransform': 'uppercase',
    'color': '#313A44',
    'backgroundColor': 'transparent',
    'border': '1px solid rgba(49, 58, 68, 0.22)',
    'borderRadius': 999,
    'padding': '6px 16px 6px 14px',
    'height': 30,
    'lineHeight': 1,
    'display': 'inline-flex',
    'alignItems': 'center',
    'gap': 8,
    'transition': 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
    '&:hover': {
      backgroundColor: 'rgba(235, 203, 0, 0.10)',
      borderColor: '#313A44',
      color: '#313A44',
    },
  },
  comparisonButtonActive: {
    'backgroundColor': '#313A44',
    'borderColor': '#313A44',
    'color': '#F5F3ED',
    '&:hover': {
      backgroundColor: '#313A44',
      borderColor: '#313A44',
      color: '#F5F3ED',
    },
  },
  comparisonDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#EBCB00',
    boxShadow: '0 0 0 3px rgba(235, 203, 0, 0.18)',
    display: 'inline-block',
  },
};

const Dashboard = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const selectedState = useSelector((state) => state.filters.selectedState);
  const selectedComparisonState = useSelector((state) => state.filters.selectedComparisonState);
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedIndicator = useSelector((state) => state.filters.selectedIndicator);
  const selectedComparisonIndicator = useSelector((state) =>
    state.filters.selectedComparisonIndicator);
  const countries = useSelector((state) => state.filters.countries);
  const indicators = useSelector((state) => state.filters.indicators);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const [amChartsInUse, setAmChartsInUse] = useState(false);
  const [showSecondMap, setShowSecondMap] = useState(false);
  const [mapsHeight, setMapsHeight] = useState(null);
  const mapsRef = useRef(null);
  const mapsResize = useRef(null);
  const mapsMinHeight = useRef(0);

  const startMapsResize = (e) => {
    e.preventDefault();
    const startHeight = mapsRef.current.getBoundingClientRect().height;
    if (!mapsMinHeight.current) mapsMinHeight.current = startHeight;
    mapsResize.current = {startY: e.clientY, startHeight};
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!mapsResize.current) return;
      const {startY, startHeight} = mapsResize.current;
      setMapsHeight(Math.max(startHeight + e.clientY - startY, mapsMinHeight.current));
    };
    const onUp = () => {
      if (!mapsResize.current) return;
      mapsResize.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);
  const contextValue = {amChartsInUse};

  const [syncYAxis, setSyncYAxis] = useState(false);
  const [mainYAxisRange, setMainYAxisRange] = useState(null);
  const [comparisonYAxisRange, setComparisonYAxisRange] = useState(null);
  const syncedYAxisRange = useMemo(() => {
    if (!syncYAxis || !showSecondMap) {
      return null;
    }
    const ranges = [mainYAxisRange, comparisonYAxisRange].filter((r) => r);
    if (ranges.length === 0) {
      return null;
    }
    return {
      min: Math.min(...ranges.map((r) => r.min)),
      max: Math.max(...ranges.map((r) => r.max)),
    };
  }, [syncYAxis, showSecondMap, mainYAxisRange, comparisonYAxisRange]);
  const onMainYAxisRangeChange = useCallback((range) => setMainYAxisRange(range), []);
  const onComparisonYAxisRangeChange = useCallback(
      (range) => setComparisonYAxisRange(range), []);


  useEffect(() => {
    dispatch(fetchCountryData(selectedIsAdm3));
    dispatch(fetchIndicatorData(selectedCountry, selectedIsAdm3));
    dispatch(fetchMapSubgroupData(selectedCountry, selectedIsAdm3));

    document.onkeydown = (e) => {
      if (e.key==='1' && e.ctrlKey) {
        setAmChartsInUse(true);
      }

      if (e.key==='2' && e.ctrlKey) {
        setAmChartsInUse(false);
      }
    };
  }, []);

  const shapeVersionFor = (indicatorId) => {
    const ind = indicators?.find((i) => i.id === indicatorId);
    return ind?.version ?? appConfig.shapefileVersion[indicatorId] ?? 1;
  };

  useEffect(() => {
    if (selectedCountry) {
      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, true,
          shapeVersionFor(selectedIndicator),
      ));

      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, false,
          shapeVersionFor(selectedComparisonIndicator),
      ));

      dispatch(fetchIndicatorData(selectedCountry, selectedIsAdm3));
      dispatch(fetchEventData());
      dispatch(fetchLayerData());
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry) {
      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, true,
          shapeVersionFor(selectedIndicator),
      ));

      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, false,
          shapeVersionFor(selectedComparisonIndicator),
      ));
    }
  }, [selectedComparisonIndicator, selectedIndicator, selectedIsAdm3]);

  return (
    <Grid container justify="center" className={classes.content2}>
      <Grid item xs={12}>
        <div className={classes.filters}>
          {selectedCountry!==undefined &&
            <CountryFilter countries={countries}>
              <YearFilter/>
              <MonthFilter/>
            </CountryFilter>
          }
          <Button
            className={
              `${classes.comparisonButton} ${showSecondMap ? classes.comparisonButtonActive : ''}`
            }
            disableRipple
            onClick={() => setShowSecondMap(!showSecondMap)}
            style={{marginLeft: 'auto', marginBottom: 4}}
          >
            <span className={classes.comparisonDot} />
            {showSecondMap ? 'Hide comparison map' : 'Show comparison map'}
          </Button>
        </div>
      </Grid>
      <ComparisonMapProvider>
        <MapContext.Provider value={contextValue}>
          <div ref={mapsRef} className={classes.mapsResizable}
            style={mapsHeight ? {height: mapsHeight} : undefined}>
            <div className={classes.mapsRow}>
              <Grid item xs={12} md={showSecondMap? 6 : 12}>
                <MapPanel primary={true} />
              </Grid>
              <Grid item xs={12} md={6} style={{display: showSecondMap? '' : 'none'}}>
                <MapPanel primary={false}/>
              </Grid>
            </div>
            <div onMouseDown={startMapsResize} className={classes.mapsResizer} />
          </div>
        </MapContext.Provider>
      </ComparisonMapProvider>
      <Grid item xs={showSecondMap ? 6 : 12} md={showSecondMap ? 6 : 12}>
        <StateData selectedState={selectedState} indicators={indicators}
          key={'primary-' + selectedIndicator}
          channel={selectedIndicator}
          sharedYAxisRange={syncedYAxisRange}
          onYAxisRangeChange={onMainYAxisRangeChange}/>
      </Grid>
      <Grid item xs={6} md={6} style={{display: showSecondMap ? '' : 'none'}}>
        <StateData selectedState={selectedComparisonState} indicators={indicators}
          key={'comparison-' + selectedComparisonIndicator}
          channel={selectedComparisonIndicator}
          sharedYAxisRange={syncedYAxisRange}
          onYAxisRangeChange={onComparisonYAxisRangeChange}
          syncYAxis={syncYAxis}
          onSyncYAxisChange={setSyncYAxis}/>
      </Grid>
    </Grid>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
