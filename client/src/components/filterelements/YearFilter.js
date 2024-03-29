import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeSelectedYear, changeYearMonthFilter} from '../../redux/actions/filters';
import {TimeseriesSlider} from './TimeseriesSlider';

/**
 * component for year selection
 * @return {React.ReactElement}
 */
const YearFilter = () => {
  const dispatch = useDispatch();
  const fromYear = 1990;
  const toYear = 2025;
  const currentYear = useSelector((state) => state.filters.currentYear);
  const [currentYearLocal, changeYearLocal] = useState(currentYear);

  return (
    <TimeseriesSlider
      key="sharedSlider"
      min={fromYear} max={toYear}
      valueLabelDisplay="on"
      value={currentYearLocal}
      step={1}
      onChange={(event, value) => {
        changeYearLocal(value);
      }}
      onChangeCommitted={(event, value) => {
        dispatch(changeSelectedYear(value));
        dispatch(changeYearMonthFilter(value));
      }}
    />
  );
};

export default YearFilter;
