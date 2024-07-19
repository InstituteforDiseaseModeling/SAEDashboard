/* eslint-disable no-unused-vars */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Map2 from './uielements/Map2.tsx';
import loader from '../image/loader.gif';
import {setGeoJsonData} from '../redux/actions/dashboard';
import {showError} from '../redux/actions/messaging';
import {useDispatch} from 'react-redux';
import {Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {AFRICA_STR, DEFAULT_THEMES} from '../const';
import config from '../app_config.json';
import {changeMapLegendMax, changeMapLegendMin} from '../redux/actions/filters';
import PropTypes from 'prop-types';
import {find, clone} from 'lodash';
import {FormattedMessage} from 'react-intl';

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
  noData: {
    height: 550,
    textAlign: 'center',
    paddingTop: 260,
    backgroundColor: '#ddd',
  },
}));

const MapPanelMap = (props) => {
  const {changeSelectedState, indicator, subgroup, primary} = props;
  const currentYear = useSelector((state) => state.filters.currentYear);
  const currentMonth = useSelector((state) => state.filters.currentMonth);
  const selectedYear = useSelector((state) => state.filters.selectedYear);
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedMapTheme = useSelector((state) => state.filters.selectedMapTheme);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const mapLegendMax = useSelector((state) => state.filters.mapLegendMax);
  const selectedIndicator =useSelector((state) => state.filters.selectedIndicator);
  const geoJson = useSelector((state) => state.dashboard.geoJson);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const selectedLegendSync = useSelector((state) => state.filters.selectedLegendSync);

  const [MapData, setData] = useState();
  const [error, setError] = useState();
  const classes = styles();
  const dispatch = useDispatch();

  const fetchData = async () => {
    axios.defaults.baseURL = process.env.API_BASE_URL || '/api';
    const dotName = selectedCountry;

    try {
      const resultRaw = await axios(
          '/map?dot_name=' + dotName + '&channel=' + selectedIndicator + '&subgroup=' + subgroup +
          '&year=' + currentYear + '&data=data' +
          '&admin_level=' + (selectedIsAdm3 ? 3:2) +
          (currentMonth ? '&month=' + currentMonth : ''),
      );

      const result2Raw = await axios(
          '/map?dot_name=' + dotName + '&channel=' + indicator + '&subgroup=' + subgroup +
          '&year=' + selectedYear + '&data=data' +
          '&admin_level=' + (selectedIsAdm3 ? 3:2) +
          (currentMonth ? '&month=' + currentMonth : ''),
      );

      /**
       * for aggregating monthly data into annual data
       * @param {*} results
       * @param {*} current
       * @return {*} array with aggregated data
       */
      const aggregateFn = (results, current) => {
        if (!Array.isArray(results)) {
          return [current];
        }
        const existing = find(results, {id: current.id});

        if (existing) {
          existing.value += current.value;
        } else {
          results.push(clone(current));
        }

        return results;
      };

      let result = [];
      let result2 = [];

      if (resultRaw && resultRaw.data) {
        result = resultRaw.data.reduce(aggregateFn, []);
      }
      if (result2Raw && result2Raw.data) {
        result2 = result2Raw.data.reduce(aggregateFn, []);
      }

      const diffResult = result.map( (item, i) => {
        const itemTocompare = _.find(result2, {id: item.id});
        return ({id: item.id, value: itemTocompare ? itemTocompare.value - item.value : undefined});
      });

      setData(primary ?
        result :
        selectedDiffMap ? diffResult : result2 );

      const maxVal = _.maxBy(result, 'value');
      const minVal = _.minBy(result, 'value');

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
  }, [indicator, subgroup, currentYear, currentMonth, selectedCountry, selectedIsAdm3,
    selectedMapTheme, selectedLegendSync, selectedYear, selectedDiffMap]);


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
    <>
      { MapData && MapData.length > 0 &&
        <div className={classes.root}>
          <Map2
            selectPlace={(state) => {
              changeSelectedState(state);
            }}
            geoJson={geoJson[selectedCountry]}
            mapData={MapData}
            primary={primary}
            zoomLevel={selectedCountry === AFRICA_STR? -1 : 1}
            selectedMapTheme={finalTheme}
            indicator={indicator}
            mapLegendMax={mapLegendMax}
            key ={mapLegendMax+selectedLegend+selectedLocale}
          />
        </div>
      }
      { !MapData || MapData.length == 0 &&
        <div className={classes.noData}>
          <FormattedMessage id='NoData'/>
        </div>
      }
    </>
  );
};

MapPanelMap.propTypes = {
  changeSelectedState: PropTypes.func,
  indicator: PropTypes.string,
  subgroup: PropTypes.string,
  primary: PropTypes.bool,
};

export default MapPanelMap;

