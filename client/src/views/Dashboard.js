import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import {useDispatch, useSelector} from 'react-redux';
import {fetchGeoJsonData, fetchHealthClinicData} from '../redux/actions/dashboard';
import MapPanel from '../components/MapPanel';
import YearFilter from '../components/filterelements/YearFilter';
import CountryFilter from '../components/filterelements/CountryFilter';
import StateData from '../components/StateData';
import {fetchCountryData, fetchIndicatorData, fetchMapSubgroupData} from '../redux/actions/filters';
import {MapContext} from '../components/context/mapContext';

const styles = {
  content2: {
    flexGrow: 1,
    minWidth: '48rem',
    margin: '0 auto',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 25,
  },
};

const Dashboard = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const selectedState = useSelector((state) => state.filters.selectedState);
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const countries = useSelector((state) => state.filters.countries);
  const indicators = useSelector((state) => state.filters.indicators);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const [amChartsInUse, setAmChartsInUse] = useState(false);
  const contextValue = {amChartsInUse};


  useEffect(() => {
    // Fetch the country data
    dispatch(fetchCountryData(selectedIsAdm3));

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
      // Fetch the geoJSON data
      dispatch(fetchGeoJsonData(selectedCountry, selectedIsAdm3));

      // Fetch the indicator data
      dispatch(fetchIndicatorData(selectedCountry, selectedIsAdm3));

      // Fetch the subgroup data
      dispatch(fetchMapSubgroupData(selectedCountry, selectedIsAdm3));

      // Fetch health clinic data
      dispatch(fetchHealthClinicData(selectedCountry, selectedIsAdm3));
    }
  }, [selectedCountry, selectedIsAdm3]);

  return (
    <Grid container justify="center" className={classes.content2}>
      <Grid item xs={12} md={4}>
        {selectedCountry!==undefined && <CountryFilter countries={countries} />}
      </Grid>
      <Grid item xs={12} md={8}>
        <YearFilter/>
      </Grid>
      <MapContext.Provider value={contextValue}>
        <Grid item xs={12} md={6}>
          <MapPanel primary />
        </Grid>
        <Grid item xs={12} md={6}>
          <MapPanel/>
        </Grid>
      </MapContext.Provider>
      <Grid item xs={12}>
        {selectedState && <StateData selectedState={selectedState} indicators={indicators}/>}
      </Grid>
    </Grid>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
