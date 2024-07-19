import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeSelectedMonth} from '../../redux/actions/filters';
import {TimeseriesSlider} from './TimeseriesSlider';


/**
 * component for year selection
 * @return {React.ReactElement}
 */
const MonthFilter = () => {
  const dispatch = useDispatch();
  const currentMonth = useSelector((state) => state.filters.currentMonth);
  const [currentMonthLocal, changeMonthLocal] = useState(currentMonth);


  return (
    <TimeseriesSlider
      key="monthSlider"
      min={0} max={12}
      valueLabelDisplay="on"
      valueLabelFormat={(value) => {
        const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[value];
      }}
      value={currentMonthLocal}
      step={1}
      onChange={(event, value) => {
        changeMonthLocal(value);
      }}
      onChangeCommitted={(event, value) => {
        dispatch(changeSelectedMonth(value));
        // dispatch(changeMonthFilter(value));
      }}
    />
  );
};

export default MonthFilter;
