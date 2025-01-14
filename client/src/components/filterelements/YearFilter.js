import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {changeSelectedYear, changeCompareYearFilter} from '../../redux/actions/filters';
import {TimeseriesSlider} from './TimeseriesSlider';
import withStyles from '@mui/styles/withStyles';


const styles = {
  root: {
    marginRight: '5px',
    marginTop: '5px',
    width: '100%',
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
  const [fromYear, setFromYear] = useState(2020);
  const [toYear, setToYear] = useState(2022);
  const currentYear = useSelector((state) => state.filters.currentYear);
  const indicators = useSelector((state) => state.filters.indicators);
  const primaryIndicator = useSelector((state) => state.filters.selectedIndicator);
  const [currentYearLocal, changeYearLocal] = useState(currentYear);

  useEffect(() => {
    const indicatorInfo = indicators.find((indicator) => indicator.id === primaryIndicator);

    if (indicatorInfo) {
      const years = Object.keys(indicatorInfo.time);
      const toYear = parseInt(years[years.length - 1]);
      setFromYear(parseInt(years[0]));

      setToYear(parseInt(toYear));
      changeYearLocal(toYear);

      dispatch(changeSelectedYear(toYear));
    };
  }, [indicators, primaryIndicator]);

  return (
    <div className={classes.root}>
      <TimeseriesSlider
        marks
        track={false}
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
          dispatch(changeCompareYearFilter(value));
        }}
      />
    </div>
  );
};


YearFilter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(YearFilter);
