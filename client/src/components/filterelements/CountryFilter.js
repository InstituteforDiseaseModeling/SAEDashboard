import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  MenuItem, Select, FormControl, InputLabel,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {changeIsAdm3, changeSelectedCountry} from '../../redux/actions/filters';
import PropTypes from 'prop-types';
import {AFRICA_STR} from '../../const';
import config from '../../app_config.json';
import * as _ from 'lodash';

const LABEL_FONT = '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 18,
    paddingTop: 12,
    paddingLeft: 6,
  },
  formControl: {
    minWidth: 220,
  },
  inputLabel: {
    fontFamily: LABEL_FONT,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#313A44 !important',
    transform: 'translate(0, -4px) scale(1)',
  },
  select: {
    'fontFamily': '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    'fontSize': 15,
    'fontWeight': 500,
    'color': '#313A44',
    '&:before': {
      borderBottom: '1px solid rgba(49, 58, 68, 0.25)',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: '2px solid #313A44',
    },
    '&:after': {
      borderBottom: '2px solid #313A44',
    },
  },
  menuPaper: {
    maxHeight: 400,
    borderRadius: 4,
    marginTop: 4,
    boxShadow: '0 6px 24px rgba(49, 58, 68, 0.18)',
  },
  admGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    paddingBottom: 2,
  },
  admLabel: {
    fontFamily: LABEL_FONT,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#313A44',
    lineHeight: 1,
  },
  toggleGroup: {
    'height': 30,
    '& .MuiToggleButton-root': {
      fontFamily: LABEL_FONT,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '4px 14px',
      color: 'rgba(49, 58, 68, 0.6)',
      border: '1px solid rgba(49, 58, 68, 0.2)',
      transition: 'all 140ms ease',
    },
    '& .MuiToggleButton-root:hover': {
      backgroundColor: 'rgba(49, 58, 68, 0.06)',
      color: '#313A44',
    },
    '& .MuiToggleButton-root.Mui-selected': {
      backgroundColor: '#313A44',
      color: '#F5F3ED',
      borderColor: '#313A44',
    },
    '& .MuiToggleButton-root.Mui-selected:hover': {
      backgroundColor: '#313A44',
    },
    '& .MuiToggleButton-root.Mui-disabled': {
      opacity: 0.45,
    },
  },
  toggleButton: {
    minWidth: 100,
  },
};

/**
 * component for selecting a country
 * @param {CountryFilter.propTypes} props
 * @return {React.ReactElement}
 */
const CountryFilter = (props) => {
  const {classes, countries, children} = props;
  const dispatch = useDispatch();
  const selectedCountry = useSelector((state) => state.filters.selectedCountry);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);

  const admDisabled = config.disableAdmin2 || selectedCountry === AFRICA_STR;

  const handleAdmChange = (_event, value) => {
    if (value === null) return;
    dispatch(changeIsAdm3(value === 'adm2'));
  };

  useEffect(()=> {
    const foundInitialCountry = _.find(countries, {id: selectedCountry});
    if (countries.length > 0 && !foundInitialCountry) {
      dispatch(changeSelectedCountry(countries[0].id));
    }
  }, [countries]);

  return (
    <div className={classes.root}>
      <FormControl variant="standard" className={classes.formControl}>
        <InputLabel
          className={classes.inputLabel}
          shrink
          sx={{color: '#313A44 !important'}}
          htmlFor="country-select">
          Country
        </InputLabel>
        <Select
          id="country-select"
          variant="standard"
          value={countries && countries.length > 0 ? selectedCountry : ''}
          onChange={(e) => dispatch(changeSelectedCountry(e.target.value))}
          className={classes.select}
          MenuProps={{classes: {paper: classes.menuPaper}}}
        >
          {countries
              .filter((field) => field.text !== 'Ethiopia')
              .map((field) => (
                <MenuItem value={field.id} key={field.id}>{field.text}</MenuItem>
              ))}
        </Select>
      </FormControl>

      <div className={classes.admGroup}>
        <span className={classes.admLabel}>Admin level</span>
        <ToggleButtonGroup
          className={classes.toggleGroup}
          value={selectedIsAdm3 ? 'adm2' : 'adm1'}
          exclusive
          size="small"
          onChange={handleAdmChange}
          disabled={admDisabled}
        >
          <ToggleButton value="adm1" className={classes.toggleButton}>Admin 1</ToggleButton>
          <ToggleButton value="adm2" className={classes.toggleButton}>Admin 2</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Extra filters (e.g. year, month) sharing this row */}
      {children}
    </div>
  );
};

CountryFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(CountryFilter);
