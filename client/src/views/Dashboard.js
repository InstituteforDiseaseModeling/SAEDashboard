import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import {useDispatch, useSelector} from 'react-redux';
import {fetchGeoJsonData, fetchHealthClinicData, fetchEventData} from '../redux/actions/dashboard';
import MapPanel from '../components/MapPanel';
import YearFilter from '../components/filterelements/YearFilter';
import MonthFilter from '../components/filterelements/MonthFilter';
import CountryFilter from '../components/filterelements/CountryFilter';
import StateData from '../components/StateData';
import RainfallData from '../components/RainfallData';
import {fetchCountryData, fetchIndicatorData, fetchMapSubgroupData} from '../redux/actions/filters';
import {MapContext} from '../components/context/mapContext';
import ComparisonMapProvider from '../components/provider/comparisonMapProvider';
import appConfig from '../app_config.json';

const styles = {
  content2: {
    flexGrow: 1,
    minWidth: '48rem',
    margin: '0 auto',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 25,
  },
  filters: {
    display: 'flex',
  },
};

const Dashboard = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const selectedState = useSelector((state) => state.filters.selectedState);
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedIndicator = useSelector((state) => state.filters.selectedIndicator);
  const selectedComparisonIndicator = useSelector((state) =>
    state.filters.selectedComparisonIndicator);
  const countries = useSelector((state) => state.filters.countries);
  const indicators = useSelector((state) => state.filters.indicators);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const [amChartsInUse, setAmChartsInUse] = useState(false);
  const contextValue = {amChartsInUse};


  useEffect(() => {
    // Fetch the country data
    dispatch(fetchCountryData(selectedIsAdm3));

    // // Fetch the indicator data
    dispatch(fetchIndicatorData(selectedCountry, selectedIsAdm3));

    // // Fetch the subgroup data
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

  useEffect(() => {
    if (selectedCountry) {
      // Fetch the geoJSON data for primary map
      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, true,
          appConfig.shapefileVersion[selectedIndicator],
      ));

      // Fetch the geoJSON data for comparison map
      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, false,
          appConfig.shapefileVersion[selectedComparisonIndicator],
      ));

      // // Fetch the indicator data
      dispatch(fetchIndicatorData(selectedCountry, selectedIsAdm3));


      // // Fetch event data
      dispatch(fetchEventData());

      // // Fetch health clinic data
      dispatch(fetchHealthClinicData());
    }
  }, [selectedCountry, selectedIsAdm3]);


  useEffect(() => {
    if (selectedCountry) {
      // Fetch the geoJSON data for primary map
      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, true,
          appConfig.shapefileVersion[selectedIndicator],
      ));

      // Fetch the geoJSON data for comparison map
      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3, false,
          appConfig.shapefileVersion[selectedComparisonIndicator],
      ));
    }
  }, [selectedComparisonIndicator, selectedIndicator]);

  return (
    <Grid container justify="center" className={classes.content2}>
      <Grid item xs={12} md={4}>
        {selectedCountry!==undefined && <CountryFilter countries={countries} />}
      </Grid>
      <Grid item xs={12} md={8}>
        <div className={classes.filters}>
          <YearFilter/>
          <MonthFilter/>
        </div>
      </Grid>
      <ComparisonMapProvider>
        <MapContext.Provider value={contextValue}>
          <Grid item xs={12} md={6}>
            <MapPanel primary={true} />
          </Grid>
          <Grid item xs={12} md={6}>
            <MapPanel primary={false}/>
          </Grid>
        </MapContext.Provider>
      </ComparisonMapProvider>
      <Grid item xs={6} md={6}>
        <StateData selectedState={selectedState} indicators={indicators}/>
      </Grid>
      <Grid item xs={6} md={6}>
        <RainfallData />
      </Grid>
    </Grid>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
