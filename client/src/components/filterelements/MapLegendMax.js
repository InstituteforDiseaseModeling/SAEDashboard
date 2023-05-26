import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormControl, TextField, InputAdornment} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {changeMapLegendMax} from '../../redux/actions/filters';
import PropTypes from 'prop-types';

const styles = ({
  title: {
    color: 'white',
  },
  hidden: {
    display: 'none',
  },
});

/**
 * component for setting Legend Max value
 * @param {MapLegendMax.propTypes} props
 * @return {React.ReactElement}
 */
const MapLegendMax = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();

  const mapLegendMax = useSelector((state) => state.filters.mapLegendMax);

  const [currentValue, changeValue] = useState(mapLegendMax);

  useEffect(()=>{
    changeValue(mapLegendMax);
  }, []);

  return (
    <FormControl variant="standard" className={classes.hidden}>
      <TextField
        id="standard-number"
        label="Legend Max"
        type="number"
        variant="standard"
        className = {classes.title}
        // InputLabelProps = {{color:"error"}}

        value={Math.round(currentValue*100)}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          inputProps: {max: 100, min: 0, step: 1, style: {'textAlign': 'center'}},
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        onChange={(e) => {
          const newVal = parseInt(e.target.value)/100;
          changeValue(newVal);
          dispatch(changeMapLegendMax(newVal));
        }}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            const newVal = parseInt(e.target.value) / 100;
            changeValue(newVal);
            dispatch(changeMapLegendMax(parseFloat(currentValue)));
          }
        }}
        onBlur={(e) => {
          return currentValue ? dispatch(changeMapLegendMax(parseFloat(currentValue))) : null;
        }}
        style={{width: '90px'}}
      />
    </FormControl>);
};

MapLegendMax.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(MapLegendMax);
