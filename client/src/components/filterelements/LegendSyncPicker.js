import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Switch, FormControl, FormLabel, FormControlLabel} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {changeLegendSync} from '../../redux/actions/filters';
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
    width: 110,
  },
};

/**
 * component for selecting a country
 * @param {LegendSyncPicker.propTypes} props
 * @return {React.ReactElement}
 */
const LegendSyncPicker = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const selectedLegendSync = useSelector((state) => state.filters.selectedLegendSync);

  const legendSyncChange = (e) => {
    dispatch(changeLegendSync(e.target.checked));
  };

  return (
    <div className={classes.root}>
      <FormControl component='fieldset' variant='standard'>
        <FormLabel component='legendSync' className={classes.formLabel}>
          <FormattedMessage id='Legend Sync'/>
        </FormLabel>
        <FormControlLabel className={classes.formControlLabel}
          label={selectedLegendSync ? 'On': 'Off'}
          control={<Switch
            color={'default'}
            checked={selectedLegendSync}
            onChange={legendSyncChange}
          />}>
        </FormControlLabel>
      </FormControl>
    </div>
  );
};

LegendSyncPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LegendSyncPicker);
