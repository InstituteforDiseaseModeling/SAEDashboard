/* eslint-disable no-unused-vars */

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import PropTypes from 'prop-types';
import {changeCompareYearFilter} from '../../redux/actions/filters';
import {FormattedMessage} from 'react-intl';
import _ from 'lodash';
import {toolbarLabelSx, toolbarSelectSx, toolbarMenuPaperSx} from './controlStyles';

const YearMonthPicker = () => {
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
    <FormControl component='fieldset' variant='standard'>
      <InputLabel shrink htmlFor="year-month-select" sx={toolbarLabelSx}>
        <FormattedMessage id='year_month'/>
      </InputLabel>
      <Select id="year-month-select"
        sx={{...toolbarSelectSx, minWidth: 80}}
        value={selectedYear}
        onChange={(e) => dispatch(changeCompareYearFilter(e.target.value))}
        MenuProps={{PaperProps: {sx: toolbarMenuPaperSx}}}
      >
        {years.map((field) => {
          return (<MenuItem value={field} key={field}>{field}</MenuItem>);
        })}
      </Select>
    </FormControl>
  );
};

export default YearMonthPicker;
