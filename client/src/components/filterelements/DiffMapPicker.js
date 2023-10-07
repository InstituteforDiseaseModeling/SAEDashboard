import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Switch, FormControl, FormLabel, FormControlLabel} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {changeDiffMap} from '../../redux/actions/filters';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

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
    width: 110,
  },
};

/**
 * component for selecting a country
 * @param {LegendPicker.propTypes} props
 * @return {React.ReactElement}
 */
const DiffMapPicker = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);

  const diffMapChange = (e) => {
    dispatch(changeDiffMap(e.target.checked));
  };

  return (
    <div className={classes.root}>
      <FormControl component='fieldset' variant='standard'>
        <FormLabel component='legend' className={classes.formLabel}>
          <FormattedMessage id='difference'/>
        </FormLabel>
        <FormControlLabel className={classes.formControlLabel}
          label={selectedDiffMap ? 'On': 'Off'}
          control={<Switch
            color={'default'}
            checked={selectedDiffMap}
            onChange={diffMapChange}
          />}>
        </FormControlLabel>
      </FormControl>
    </div>
  );
};

DiffMapPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DiffMapPicker);
