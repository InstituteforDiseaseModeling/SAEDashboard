import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Switch, FormControl, FormLabel, FormControlLabel, Typography} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import {changeSelectedLegend} from '../../redux/actions/filters';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

const styles = {
  formControlLabel: {
    marginLeft: 5,
    marginTop: 0,
    color: 'black',
    height: 22,
    paddingBottom: 8,
  },
  label: {
    fontSize: '0.9rem',
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
    width: 220,
  },

};

/**
 * component for selecting a country
 * @param {LegendPicker.propTypes} props
 * @return {React.ReactElement}
 */
const LegendPicker = (props) => {
  const {classes} = props;
  const dispatch = useDispatch();
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);

  const legendToggleChange = (e) => {
    dispatch(changeSelectedLegend(e.target.checked));
  };


  return (
    <div className={classes.root}>
      <FormControl component='fieldset' variant='standard'>
        <FormLabel component='legend' className={classes.formLabel}>
          <FormattedMessage id='legend'/>
        </FormLabel>
        <FormControlLabel className={classes.formControlLabel}
          label={
            selectedLegend ?
            <Typography className={classes.label}>
              <FormattedMessage id='equal_interval'/>
            </Typography>:
            <Typography className={classes.label}>
              <FormattedMessage id='pnlp_legend'/>
            </Typography>
          }
          control={<Switch
            checked={selectedLegend}
            onChange={legendToggleChange}
          />}>
        </FormControlLabel>
      </FormControl>
    </div>
  );
};

LegendPicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LegendPicker);
