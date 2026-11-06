import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {changeSelectedYear, changeCompareYearFilter} from '../../redux/actions/filters';

const LABEL_FONT = '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif';

// component styles — GF-styled dropdown, matching CountryFilter
const styles = {
  // Spacing comes from the CountryFilter row this sits in.
  root: {},
  formControl: {
    minWidth: 120,
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
    'fontFamily': LABEL_FONT,
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
};

/**
 * component for year selection
 * @return {React.ReactElement}
 * @param {YearFilter.propTypes} props
 */
const YearFilter = (props) => {
  const {classes} = props;

  const dispatch = useDispatch();
  const [years, setYears] = useState([]);
  const currentYear = useSelector((state) => state.filters.currentYear);
  const indicators = useSelector((state) => state.filters.indicators);
  const primaryIndicator = useSelector((state) => state.filters.selectedIndicator);
  const [currentYearLocal, changeYearLocal] = useState(currentYear);

  useEffect(() => {
    const indicatorInfo = indicators.find((indicator) => indicator.id === primaryIndicator);

    if (indicatorInfo) {
      const availableYears = Object.keys(indicatorInfo.time).map((y) => parseInt(y));
      const toYear = availableYears[availableYears.length - 1];

      setYears(availableYears);
      changeYearLocal(toYear);

      dispatch(changeSelectedYear(toYear));
      dispatch(changeCompareYearFilter(toYear));
    };
  }, [indicators, primaryIndicator]);

  const handleChange = (event) => {
    const value = event.target.value;
    changeYearLocal(value);
    dispatch(changeSelectedYear(value));
    dispatch(changeCompareYearFilter(value));
  };

  const selectValue = years.includes(currentYearLocal) ? currentYearLocal : '';

  return (
    <div className={classes.root}>
      <FormControl variant="standard" className={classes.formControl}>
        <InputLabel
          className={classes.inputLabel}
          shrink
          sx={{color: '#313A44 !important'}}
          htmlFor="year-select">
          Year
        </InputLabel>
        <Select
          id="year-select"
          variant="standard"
          value={selectValue}
          onChange={handleChange}
          className={classes.select}
          MenuProps={{classes: {paper: classes.menuPaper}}}
        >
          {years.map((year) => (
            <MenuItem value={year} key={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};


YearFilter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(YearFilter);
