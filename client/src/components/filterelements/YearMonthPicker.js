/* eslint-disable no-unused-vars */

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import {changeCompareYearFilter} from '../../redux/actions/filters';
import {FormattedMessage} from 'react-intl';
import _ from 'lodash';

const styles = {
  formControlLabel: {
    marginLeft: 5,
    marginTop: 0,
    color: 'black',
    height: 22,
  },
  formLabel: {
    color: 'white',
    top: -6,
    left: 15,
    fontSize: '0.75rem',
  },
  menuPaper: {
    maxHeight: 400,
  },
  root: {
    // display: 'flex',
    // justifyContent: 'space-evenly',
    width: 100,
  },

};

// const years = [2020, 2021, 2022];

/**
 * component for selecting a country
 * @param {LegendPicker.propTypes} props
 * @return {React.ReactElement}
 */
const YearMonthPicker = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const [fromYear, setFromYear] = useState(2020);
  const [toYear, setToYear] = useState(2022);
  let [years, setYears] = useState([2020, 2021, 2022]);

  const selectedYear = useSelector((state) => state.filters.selectedYear);
  const indicators = useSelector((state) => state.filters.indicators);
  const selectedComparisonIndicator = useSelector((state) =>
    state.filters.selectedComparisonIndicator);

  const getYearsFromIndicator = () => {
    const indicatorInfo = indicators.find(
        (indicator) => indicator.id === selectedComparisonIndicator);

    if (indicatorInfo) {
      const yearRange = Object.keys(indicatorInfo.time);
      const fromYear = parseInt(yearRange[0]);
      const toYear = parseInt(yearRange[yearRange.length - 1]);

      const _years = [];
      for (let i = fromYear; i <= toYear; i++) {
        _years.push(i);
      }
      if (_years.length === 0) {
        debugger;
      }
      years = [..._years];
      setYears(_years);
    };
  };

  useEffect(() => {
    getYearsFromIndicator();
  }, [indicators, selectedComparisonIndicator]);

  if (!years || years.length === 0) {
    debugger;
  }

  return (
    <div className={classes.root}>
      <FormControl component='fieldset' variant='standard'>
        <InputLabel htmlFor="mapTheme-select">
          <FormattedMessage id='year_month'/>
        </InputLabel>
        <Select id="mapTheme-select"
          style={{minWidth: '80px'}}
          value={selectedYear}
          onChange={(e) => dispatch(changeCompareYearFilter(e.target.value))}
          MenuProps={{classes: {paper: classes.menuPaper}}}
        >
          {years.map((field) => {
            return (<MenuItem value={field} key={field}>{field}</MenuItem>);
          })}
        </Select>
      </FormControl>
    </div>
  );
};

YearMonthPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(YearMonthPicker);
