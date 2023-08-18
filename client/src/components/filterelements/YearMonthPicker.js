/* eslint-disable no-unused-vars */

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import {changeYearMonthFilter} from '../../redux/actions/filters';
import {createArray} from '../../utils/utils';

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

const years = createArray(1995, 2025);

/**
 * component for selecting a country
 * @param {LegendPicker.propTypes} props
 * @return {React.ReactElement}
 */
const YearMonthPicker = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const selectedMonthYear = useSelector((state) => state.filters.selectedYearMonth);

  return (
    <div className={classes.root}>
      <FormControl component='fieldset' variant='standard'>
        <InputLabel htmlFor="mapTheme-select">Year/Month</InputLabel>
        <Select id="mapTheme-select"
          style={{minWidth: '80px'}}
          value={selectedMonthYear}
          onChange={(e) => dispatch(changeYearMonthFilter(e.target.value))}
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
