import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeSelectedMonth} from '../../redux/actions/filters';
import {TimeseriesSlider} from './TimeseriesSlider';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';

const styles = {
  root: {
    marginTop: '5px',
    width: '100%',
  },
};
/**
 * component for month selection
 * @param {MonthFilter.propTypes} props
 * @return {React.ReactElement}
 */
const MonthFilter = (props) => {
  const {classes} = props;

  const dispatch = useDispatch();
  const currentMonth = useSelector((state) => state.filters.currentMonth);
  const [currentMonthLocal, changeMonthLocal] = useState(currentMonth);


  return (
    <div className={classes.root}>
      <TimeseriesSlider
        key="monthSlider"
        min={0} max={12}
        valueLabelDisplay="on"
        valueLabelFormat={(value) => {
          const months = ['month-All', 'month-Jan', 'month-Feb', 'month-Mar', 'month-Apr',
            'month-May', 'month-Jun', 'month-Jul', 'month-Aug', 'month-Sep', 'month-Oct',
            'month-Nov', 'month-Dec'];
          return props.intl.formatMessage({id: months[value]});
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
    </div>
  );
};

MonthFilter.propTypes = {
  intl: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(MonthFilter));
