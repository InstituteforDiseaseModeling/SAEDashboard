import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {MenuItem, Select, Switch, FormControl, FormControlLabel, InputLabel} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {changeIsAdm3, changeSelectedCountry} from '../../redux/actions/filters';
import PropTypes from 'prop-types';
import {AFRICA_STR} from '../../const';
import config from '../../app_config.json';
import * as _ from 'lodash';


const styles = {
  formControl: {
    marginLeft: 5,
    marginTop: 13,
  },
  select: {
    minWidth: 200,
  },
  menuPaper: {
    maxHeight: 400,
  },
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },

};

/**
 * component for selecting a country
 * @param {CountryFilter.propTypes} props
 * @return {React.ReactElement}
 */
const CountryFilter = (props) => {
  const {classes, countries} = props;
  const dispatch = useDispatch();
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);

  const admLevelToggleChange = (e) => {
    dispatch(changeIsAdm3(e.target.checked));
  };

  useEffect(()=> {
    // if default country is not found in the country list, use
    // first country in the list
    const foundInitialCountry = _.find(countries, {id: selectedCountry});
    if (countries.length > 0 && !foundInitialCountry) {
      dispatch(changeSelectedCountry(countries[0].id));
    }
  }, [countries]);

  return (
    <div className={classes.root}>
      <FormControl variant="standard" className={classes.formControl}>
        <InputLabel sx={{color: '#2196f3'}} htmlFor="country-select">Country</InputLabel>
        <Select id="country-select" value={countries && countries.length > 0 ? selectedCountry: ''}
          onChange={(e) => dispatch(changeSelectedCountry(e.target.value))}
          className={classes.select}
          MenuProps={{classes: {paper: classes.menuPaper}}}
        >
          {countries.map((field, i) => {
            if (field.text !== 'Ethiopia') {
              return (<MenuItem value={field.id} key={i}>{field.text}</MenuItem>);
            }
          })}
        </Select>
      </FormControl>
      <FormControlLabel className={classes.formControl}
        label={selectedIsAdm3 ? 'Admin 2': 'Admin 1'}
        control={<Switch
          checked={selectedIsAdm3}
          disabled={config.disableAdmin2 || selectedCountry===AFRICA_STR }
          onChange={admLevelToggleChange}
          color="primary"
        />}>
      </FormControlLabel>
    </div>
  );
};

CountryFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
};

export default withStyles(styles)(CountryFilter);
