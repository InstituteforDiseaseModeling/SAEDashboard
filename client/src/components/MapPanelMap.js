/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Map2 from './uielements/Map2.tsx';
import loader from '../image/loader.gif';
import {showError} from '../redux/actions/messaging';
import {useDispatch} from 'react-redux';
import {Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {AFRICA_STR, DEFAULT_THEME, DEFAULT_THEMES} from '../const';
import config from '../app_config.json';
import {changeMapLegendMax, changeMapLegendMin} from '../redux/actions/filters';
import PropTypes from 'prop-types';
import {find, clone} from 'lodash';
import {FormattedMessage} from 'react-intl';
import {useIndicatorConfig} from '../hooks/useAppConfig.ts';


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
    flex: 1,
    minHeight: 550,
  },
  noData: {
    flex: 1,
    minHeight: 550,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
}));

const MapPanelMap = (props) => {
  const {changeSelectedState, primary} = props;
  const currentYear = useSelector((state) => state.filters.currentYear);
  const currentMonth = useSelector((state) => state.filters.currentMonth);
  const selectedYear = useSelector((state) => state.filters.selectedYear);
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedMapTheme = useSelector((state) => state.filters.selectedMapTheme);
  const selectedComparisonMapTheme = useSelector((state) =>
    state.filters.selectedComparisonMapTheme);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const mapLegendMax = useSelector((state) => state.filters.mapLegendMax);
  const selectedIndicator =useSelector((state) => state.filters.selectedIndicator);
  const selectedComparisonIndicator =useSelector((state) =>
    state.filters.selectedComparisonIndicator);
  const selectedIndicatorConfig = useIndicatorConfig(selectedIndicator);
  const comparisonIndicatorConfig = useIndicatorConfig(selectedComparisonIndicator);
  const geoJsonPrimary = useSelector((state) => state.dashboard.geoJsonPrimary);
  const geoJsonComparison = useSelector((state) => state.dashboard.geoJsonComparison);

  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const selectedLegendSync = useSelector((state) => state.filters.selectedLegendSync);
  const indicators = useSelector((state) => state.filters.indicators);
  const selectedSubgroup = useSelector((state) => state.filters.selectedSubgroup);
  const selectedComparisonSubgroup = useSelector((state) => state.filters.selectedComparisonSubgroup);

  const [MapData, setData] = useState();
  const [error, setError] = useState();
  const classes = styles();
  const dispatch = useDispatch();

  const indicator = primary ? selectedIndicator : selectedComparisonIndicator;

  const fetchData = async (signal) => {
    const http = axios.create({baseURL: process.env.API_BASE_URL || '/api'});
    const dotName = selectedCountry;

    const mainShapeFileVersion = indicators?.find((i) => i.id === selectedIndicator)?.version ??
      config.shapefileVersion[selectedIndicator] ?? 1;

    const comparisonShapeFileVersion = indicators?.find((i) => i.id === selectedComparisonIndicator)?.version ??
      config.shapefileVersion[selectedComparisonIndicator] ?? 1;

    try {
      const mirrorsMain = primary || selectedDiffMap;
      const primaryInd = mirrorsMain ? selectedIndicator : selectedComparisonIndicator;
      const primaryAdminLevel = selectedIsAdm3 ? 2 : 1;

      const resultRaw = await http(
          '/map?dot_name=' + dotName + '&channel=' + primaryInd +
          '&subgroup=' + (mirrorsMain ? selectedSubgroup : selectedComparisonSubgroup) +
          '&year=' + (mirrorsMain ? currentYear : selectedYear) + '&data=data' +
          '&admin_level=' + primaryAdminLevel +
          '&shape_version=' + (mirrorsMain ? mainShapeFileVersion : comparisonShapeFileVersion) +
          (currentMonth ? '&month=' + currentMonth : ''),
          {signal},
      ).catch((error) => {
        throw error;
      });

      let result2Raw=[];
      if (!primary && selectedDiffMap) {
        result2Raw = await http(
            '/map?dot_name=' + dotName + '&channel=' + selectedComparisonIndicator +
              '&subgroup=' + selectedComparisonSubgroup +
            '&year=' + selectedYear + '&data=data' +
            '&admin_level=' + primaryAdminLevel +
            '&shape_version=' + comparisonShapeFileVersion +
            (currentMonth ? '&month=' + currentMonth : ''),
            {signal},
        );
      }

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

      const averageFn = (results, current) => {
        if (!Array.isArray(results)) {
          return [current];
        }
        const existing = find(results, {id: current.id});

        if (existing) {
          existing.value = (existing.value * existing.count + current.value) / (existing.count + 1);
          existing.count += 1;
        } else {
          current.count = 1;
          results.push(clone(current));
        }

        return results;
      };

      let result = [];
      let result2 = [];

      const result1UseAvg = (mirrorsMain ? selectedIndicatorConfig : comparisonIndicatorConfig)?.useAvg;
      const result2UseAvg = comparisonIndicatorConfig?.useAvg;

      if (resultRaw && resultRaw.data) {
        result = resultRaw.data.reduce(result1UseAvg ? averageFn : aggregateFn, []);
      }
      if (result2Raw && result2Raw.data) {
        result2 = result2Raw.data.reduce(result2UseAvg ? averageFn : aggregateFn, []);
      }

      const diffResult = result.map( (item, i) => {
        const itemTocompare = _.find(result2, {id: item.id});
        return ({id: item.id, value: itemTocompare ? itemTocompare.value - item.value : undefined});
      });


      setData(primary ? result : (selectedDiffMap ? diffResult : result));

      const maxVal = _.maxBy(result, 'value');
      const minVal = _.minBy(result, 'value');

      if (primary && maxVal) {
        dispatch(changeMapLegendMax(maxVal.value));
      }
      if (primary && maxVal) {
        dispatch(changeMapLegendMin(minVal.value));
      }
    } catch (data) {
      if (axios.isCancel(data)) return;
      const status = data.response && data.response.status;
      if (status === 400 || status === 404) {
        setData([]);
        return;
      }
      const detail = data.response && data.response.data && data.response.data.detail;
      const errMsg = typeof detail === 'string' ? detail : 'Error occurred.';
      dispatch(showError(errMsg));
      setError(errMsg);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const activeSubgroup = primary ? selectedSubgroup : selectedComparisonSubgroup;
    if (indicator && activeSubgroup && selectedCountry) {
      setData(null);
      setError();
      fetchData(abortController.signal);
    }
    return () => abortController.abort();
  }, [indicator, currentYear, currentMonth, selectedCountry,
    selectedIsAdm3, selectedLegendSync, selectedYear,
    selectedSubgroup, selectedComparisonSubgroup,
    selectedDiffMap, indicators]);


  const requiredGeoJson = primary ? geoJsonPrimary : geoJsonComparison;

  if (!indicator) {
    if (requiredGeoJson) {
      return (
        <div className={classes.root}>
          <Map2
            selectPlace={(state) => changeSelectedState(state)}
            geoJson={requiredGeoJson[selectedCountry]}
            mapData={[]}
            primary={primary}
            zoomLevel={selectedCountry === AFRICA_STR ? -1 : 1}
            selectedMapTheme={DEFAULT_THEME}
            indicator={''}
            key={[selectedCountry, selectedIsAdm3 ? 'a2' : 'a1', 'empty'].join('|')}
          />
        </div>
      );
    }
    return (
      <div className={classes.noData}>
        <FormattedMessage id='no_indicators'/>
      </div>);
  }

  if (error) {
    return (
      <div className={classes.error}>
        <Typography variant="body2">
          {error}
        </Typography>
      </div>);
  }


  if (Array.isArray(MapData) && MapData.length === 0) {
    return (
      <div className={classes.noData}>
        No data available
      </div>);
  }

  const activeTheme = primary ? selectedMapTheme : selectedComparisonMapTheme;
  if (!MapData || !requiredGeoJson || !activeTheme) {
    return (
      <div className={classes.loading}>
        <img src={loader} alt={'Loading...'}/>
      </div>);
  }

  const userTheme = (indicators.find((i) => i.id === indicator) || {}).color_theme;
  const configTheme = config.defaultThemeByIndicator && config.defaultThemeByIndicator[indicator];
  const indicatorTheme = configTheme || userTheme;
  let finalTheme = null;

  if (primary) {
    finalTheme = indicator && DEFAULT_THEMES.indexOf(selectedMapTheme) >= 0 ?
      indicatorTheme || selectedMapTheme :
      selectedMapTheme;
  } else {
    finalTheme = indicator && DEFAULT_THEMES.indexOf(selectedComparisonMapTheme)>=0 ?
      indicatorTheme || selectedComparisonMapTheme :
      selectedComparisonMapTheme;
  }
  if (indicator.indexOf('covars')>-1) {
    finalTheme = configTheme;
  }
  if (!finalTheme) finalTheme = indicatorTheme || DEFAULT_THEME;


  return (
    <>
      { MapData && MapData.length > 0 &&
        <div className={classes.root}>
          <Map2
            selectPlace={(state) => {
              changeSelectedState(state);
            }}
            geoJson={primary ?
              (geoJsonPrimary && geoJsonPrimary[selectedCountry]) :
              (geoJsonComparison && geoJsonComparison[selectedCountry])
            }
            mapData={MapData}
            primary={primary}
            zoomLevel={selectedCountry === AFRICA_STR? -1 : 1}
            selectedMapTheme={finalTheme}
            indicator={indicator}
            mapLegendMax={mapLegendMax}
            key={[
              mapLegendMax, selectedLegend, selectedLocale, finalTheme,
              primary ? 'p' : 'c',
              selectedCountry,
              (primary ? geoJsonPrimary : geoJsonComparison)?.[selectedCountry]?.features?.length ?? 'na',
              selectedIsAdm3 ? 'a2' : 'a1',
            ].join('|')}
          />
        </div>
      }
      { (!MapData || MapData.length === 0) &&
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
  primary: PropTypes.bool,
};

export default MapPanelMap;
