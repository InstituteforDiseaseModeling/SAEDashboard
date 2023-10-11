import React from 'react';
import {useSelector} from 'react-redux';
import {MenuItem, Select} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

/**
 * component for indicator selection
 * @param {IndicatorFilter.propTypes} props
 * @return {React.ReactElement}
 */
const IndicatorFilter = (props) => {
  const {selectedIndicator, changeIndicator} = props;
  const indicators = useSelector((state) => state.filters.indicators);

  return (
    <FormControl variant="standard">
      <InputLabel htmlFor="indicator-select">
        <FormattedMessage id='indicators'/>
      </InputLabel>
      <Select id="indicator-select" value={selectedIndicator || ''}
        onChange={(e) => changeIndicator(e.target.value)}
      >
        {indicators.map((field, i) => {
          return (<MenuItem value={field.id} key={i}><FormattedMessage id={field.text}/>
          </MenuItem>);
        })}
      </Select>
    </FormControl>);
};

IndicatorFilter.propTypes = {
  selectedIndicator: PropTypes.string,
  changeIndicator: PropTypes.func,
  primary: PropTypes.bool,
};

export default IndicatorFilter;
