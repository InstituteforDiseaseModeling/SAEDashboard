import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Map from './uielements/Map';
import Map2 from './uielements/Map2.tsx';
import loader from '../image/loader.gif';
import {setGeoJsonData} from '../redux/actions/dashboard';
import {showError} from '../redux/actions/messaging';
import {useDispatch} from 'react-redux';
import {Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {AFRICA_STR, DEFAULT_THEMES} from '../const';
import config from '../app_config.json';
import {MapContext} from '../components/context/mapContext';
import {changeMapLegendMax, changeMapLegendMin} from '../redux/actions/filters';
import PropTypes from 'prop-types';


const styles = makeStyles(({
  error: {
    display: 'flex',
    height: '550px',
    color: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0px 25px',
  },
  loading: {
    textAlign: 'center',
  },
  root: {
    height: '550px',
  },
}));

const MapPanelMap = (props) => {
  const {changeSelectedState, indicator, subgroup, primary} = props;
  const currentYear = useSelector((state) => state.filters.currentYear);
  const selectedYearMonth = useSelector((state) => state.filters.selectedYearMonth);
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedMapTheme = useSelector((state) => state.filters.selectedMapTheme);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const mapLegendMax = useSelector((state) => state.filters.mapLegendMax);
  const selectedIndicator = useSelector((state) => state.filters.selectedIndicator);
  const selectedSubgroup = useSelector((state) => state.filters.selectedSubgroup);
  const geoJson = useSelector((state) => state.dashboard.geoJson);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);
  const [MapData, setData] = useState();
  const [error, setError] = useState();
  const classes = styles();
  const dispatch = useDispatch();
  const {amChartsInUse} = useContext(MapContext);

  const fetchData = async () => {
    axios.defaults.baseURL = process.env.API_BASE_URL || '/api';
    const dotName = selectedCountry;

    try {
      const result = await axios(
          '/map?dot_name=' + dotName + '&channel=' + selectedIndicator + '&subgroup=' +
          selectedSubgroup +
          '&year=' + currentYear + '&data=data' +
          '&admin_level=' + (selectedIsAdm3 ? 3:2),
      );

      const result2 = await axios(
          '/map?dot_name=' + dotName + '&channel=' + indicator + '&subgroup=' + subgroup +
          '&year=' + selectedYearMonth + '&data=data' +
          '&admin_level=' + (selectedIsAdm3 ? 3:2),
      );

      const diffResult = result.data.map( (item, i) => {
        const itemTocompare = _.find(result2.data, {id: item.id});

        return ({id: item.id, value: itemTocompare ? itemTocompare.value - item.value : undefined});
      });

      setData(primary ?
        result.data :
        selectedDiffMap ? diffResult : result2.data );

      const maxVal = _.maxBy(result.data, 'value');
      const minVal = _.minBy(result.data, 'value');


      if (primary && maxVal) {
        dispatch(changeMapLegendMax(maxVal.value));
      }
      if (primary && maxVal) {
        dispatch(changeMapLegendMin(minVal.value));
      }
    } catch (data) {
      let errMsg = 'Error occurred.';
      if (data.response && data.response.data) {
        errMsg = data.response.data;
      }

      dispatch(showError(errMsg));
      setError(errMsg);
    }
  };

  useEffect(() => {
    if (indicator && subgroup && selectedCountry) {
      // Reset data for map
      setGeoJsonData(null);
      setData(null);
      setError();

      // Fetch data for map
      fetchData();
    }
  }, [indicator, subgroup, currentYear, selectedCountry, selectedIsAdm3, selectedMapTheme,
    selectedYearMonth, selectedDiffMap]);


  if (error) {
    return (
      <div className={classes.error}>
        <Typography variant="body2">
          {error}
        </Typography>
      </div>);
  }

  if (!MapData || !geoJson || !selectedMapTheme) {
    return (
      <div className={classes.loading}>
        <img src={loader} alt={'Loading...'}/>
      </div>);
  }

  // calculate final theme based on config
  const finalTheme = indicator && DEFAULT_THEMES.indexOf(selectedMapTheme)>=0 ?
                   config.defaultThemeByIndicator[indicator] :
                   selectedMapTheme;


  return (
    <div className={classes.root}>
      { amChartsInUse &&
        <Map
          selectPlace={(state) => {
            changeSelectedState(state);
          }}
          geoJson={geoJson[selectedCountry]}
          mapData={MapData}
          primary={primary}
          zoomLevel={selectedCountry === AFRICA_STR? -1 : 1}
          selectedMapTheme={finalTheme}
          mapLegendMax={mapLegendMax}
          key ={mapLegendMax}
        />
      }
      { !amChartsInUse &&
        <Map2
          selectPlace={(state) => {
            changeSelectedState(state);
          }}
          geoJson={geoJson[selectedCountry]}
          mapData={MapData}
          primary={primary}
          zoomLevel={selectedCountry === AFRICA_STR? -1 : 1}
          selectedMapTheme={finalTheme}
          subgroup={subgroup}
          indicator={indicator}
          mapLegendMax={mapLegendMax}
          key ={mapLegendMax+selectedLegend}
        />
      }
    </div>
  );
};

MapPanelMap.propTypes = {
  changeSelectedState: PropTypes.func,
  indicator: PropTypes.string,
  subgroup: PropTypes.string,
  primary: PropTypes.bool,
};

export default MapPanelMap;

