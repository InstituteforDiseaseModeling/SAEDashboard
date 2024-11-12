/* eslint-disable no-unused-vars */
import React from 'react';
import {useSelector} from 'react-redux';
import {ListSubheader, MenuItem, Select} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {makeStyles} from '@mui/styles';

// import * as _ from 'lodash';
const styles = makeStyles({
  menuItem: {
    paddingLeft: '30px',
    lineHeight: '15px',
  },
  subHeader: {
    textTransform: 'uppercase',
    // textDecoration: 'underline',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'grey',
    lineHeight: '30px',
  },
});
/**
 * component for indicator selection
 * @param {IndicatorFilter.propTypes} props
 * @return {React.ReactElement}
 */
const IndicatorFilter = (props) => {
  const {selectedIndicator, changeIndicator} = props;
  const indicators = useSelector((state) => state.filters.indicators);
  const classes = styles();


  return (
    <FormControl variant="standard">
      <InputLabel htmlFor="indicator-select">
        <FormattedMessage id='indicators'/>
      </InputLabel>
      <Select id="indicator-select" value={selectedIndicator || ''}
        onChange={(e) => changeIndicator(e.target.value)}
      >
        {/* intervention */}
        <ListSubheader className={classes.subHeader}>
          <FormattedMessage id="intervention"/>
        </ListSubheader>
        <MenuItem value="CDM" key={1} className={classes.menuItem}>
          <FormattedMessage id="CDM"/></MenuItem>
        <MenuItem value="CDM_Coverage" key={2} className={classes.menuItem}>
          <FormattedMessage id="CDM_Coverage"/></MenuItem>
        <MenuItem value="MILDA" key={3} className={classes.menuItem}>
          <FormattedMessage id="MILDA"/></MenuItem>
        <MenuItem value="MILDA_Coverage" key={4} className={classes.menuItem}>
          <FormattedMessage id="MILDA_Coverage"/></MenuItem>
        <MenuItem value="IPTp3" key={5} className={classes.menuItem}>
          <FormattedMessage id="IPTp3"/></MenuItem>
        <MenuItem value="SMC" key={6} className={classes.menuItem}>
          <FormattedMessage id="SMC"/></MenuItem>
        {/* case management */}
        <MenuItem value="correct_treatment" key={7} className={classes.menuItem}>
          <FormattedMessage id="correct_treatment"/></MenuItem>
        <MenuItem value="testing_rates" key={8} className={classes.menuItem}>
          <FormattedMessage id="testing_rates"/></MenuItem>
        {/* Malaria Epidemiology */}
        <ListSubheader className={classes.subHeader}>
          <FormattedMessage id="malaria_epidemiology"/>
        </ListSubheader>
        <MenuItem value="reported_incidence" key={9} className={classes.menuItem}>
          <FormattedMessage id="reported_incidence"/>
        </MenuItem>
        <MenuItem value="predicted_incidence" key={10} className={classes.menuItem}>
          <FormattedMessage id="predicted_incidence"/>
        </MenuItem>
        <MenuItem value="low_model_predictions" key={12} className={classes.menuItem}>
          <FormattedMessage id="low_model_predictions"/>
        </MenuItem>
        <MenuItem value="high_model_predictions" key={11} className={classes.menuItem}>
          <FormattedMessage id="high_model_predictions"/>
        </MenuItem>
        <MenuItem value="tpr" key={15} className={classes.menuItem}>
          <FormattedMessage id="tpr"/>
        </MenuItem>
        <MenuItem value="incidence" key={15} className={classes.menuItem}>
          <FormattedMessage id="incidence"/>
        </MenuItem>
        <MenuItem value="gambiae" key={17} className={classes.menuItem}>
          <FormattedMessage id="species"/>
        </MenuItem>

        {/* Environmental */}
        <ListSubheader className={classes.subHeader}>
          <FormattedMessage id="environmental"/>
        </ListSubheader>
        <MenuItem value="weather_zones" key={12} className={classes.menuItem}>
          <FormattedMessage id="weather_zones"/>
        </MenuItem>
        <MenuItem value="neg_covars" key={13} className={classes.menuItem}>
          <FormattedMessage id="neg_covars"/>
        </MenuItem>
        <MenuItem value="pos_covars" key={14} className={classes.menuItem}>
          <FormattedMessage id="pos_covars"/>
        </MenuItem>
        <MenuItem value="neg_covars_category" key={15} className={classes.menuItem}>
          <FormattedMessage id="neg_covars_category"/>
        </MenuItem>
        <MenuItem value="pos_covars_category" key={16} className={classes.menuItem}>
          <FormattedMessage id="pos_covars_category"/>
        </MenuItem>

        {/* Entomology */}
        <ListSubheader className={classes.subHeader}>
          <FormattedMessage id="entomology"/>
        </ListSubheader>
      </Select>
    </FormControl>);
};

IndicatorFilter.propTypes = {
  selectedIndicator: PropTypes.string,
  changeIndicator: PropTypes.func,
  primary: PropTypes.bool,
};

export default IndicatorFilter;
