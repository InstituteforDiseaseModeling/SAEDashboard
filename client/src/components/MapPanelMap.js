/* eslint-disable no-unused-vars */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Map2 from './uielements/Map2.tsx';
import loader from '../image/loader.gif';
import {setGeoJsonPrimary, setGeoJsonComparison} from '../redux/actions/dashboard';
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
  const {changeSelectedState, subgroup, primary} = props;
  const currentYear = useSelector((state) => state.filters.currentYear);
  const currentMonth = useSelector((state) => state.filters.currentMonth);
  const selectedYear = useSelector((state) => state.filters.selectedYear);
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedMapTheme = useSelector((state) => state.filters.selectedMapTheme);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const mapLegendMax = useSelector((state) => state.filters.mapLegendMax);
  const selectedIndicator =useSelector((state) => state.filters.selectedIndicator);
  const selectedComparisonIndicator =useSelector((state) =>
    state.filters.selectedComparisonIndicator);
  const geoJsonPrimary = useSelector((state) => state.dashboard.geoJsonPrimary);
  const geoJsonComparison = useSelector((state) => state.dashboard.geoJsonComparison);

  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const selectedLegendSync = useSelector((state) => state.filters.selectedLegendSync);

  const [MapData, setData] = useState();
  const [error, setError] = useState();
  const classes = styles();
  const dispatch = useDispatch();

  const indicator = primary ? selectedIndicator : selectedComparisonIndicator;

  const fetchData = async () => {
    axios.defaults.baseURL = process.env.API_BASE_URL || '/api';
    const dotName = selectedCountry;

    const mainShapeFileVersion = config.shapefileVersion[selectedIndicator] ?
      config.shapefileVersion[selectedIndicator] : 1;

    const comparisonShapeFileVersion = config.shapefileVersion[selectedComparisonIndicator] ?
      config.shapefileVersion[selectedComparisonIndicator] : 1;

    try {
      const resultRaw = await axios(
          '/map?dot_name=' + dotName + '&channel=' + selectedIndicator + '&subgroup=' + subgroup +
          '&year=' + currentYear + '&data=data' +
          '&admin_level=' + (selectedIsAdm3 ? 3:2) +
          '&shape_version=' + mainShapeFileVersion +
          (currentMonth ? '&month=' + currentMonth : ''),
      );

      const result2Raw = await axios(
          '/map?dot_name=' + dotName + '&channel=' + selectedComparisonIndicator +
            '&subgroup=' + subgroup +
          '&year=' + selectedYear + '&data=data' +
          '&admin_level=' + (selectedIsAdm3 ? 3:2) +
          '&shape_version=' + comparisonShapeFileVersion +
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
      setGeoJsonPrimary(null);
      setGeoJsonComparison(null);
      setData(null);
      setError();

      // Fetch data for map
      fetchData();
    }
  }, [indicator, subgroup, currentYear, currentMonth, selectedCountry,
    selectedIsAdm3, selectedMapTheme, selectedLegendSync, selectedYear,
    geoJsonPrimary, geoJsonComparison,
    selectedDiffMap]);


  if (error) {
    return (
      <div className={classes.error}>
        <Typography variant="body2">
          {error}
        </Typography>
      </div>);
  }


  if (!MapData || !(geoJsonPrimary) || !(geoJsonComparison) ||
    !selectedMapTheme) {
    return (
      <div className={classes.loading}>
        <img src={loader} alt={'Loading...'}/>
      </div>);
  }

  // calculate final theme based on config
  let finalTheme = indicator && DEFAULT_THEMES.indexOf(selectedMapTheme)>=0 ?
                   config.defaultThemeByIndicator[indicator] :
                   selectedMapTheme;
  // keep theme for covars related indicators
  if (indicator.indexOf('covars')>-1) {
    finalTheme =config.defaultThemeByIndicator[indicator];
  }


  return (
    <>
      { MapData && MapData.length > 0 &&
        <div className={classes.root}>
          <Map2
            selectPlace={(state) => {
              changeSelectedState(state);
            }}
            geoJson={primary ? geoJsonPrimary[selectedCountry] :
              geoJsonComparison[selectedCountry]
            }
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

