import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

/**
 * component for a list of switches for toggling the display of charts
 * @param {ChartSubgroupsFilter.propTypes} props
 * @return {React.ReactElement}
 */
const ChartSubgroupsFilter = (props) => {
  const {groups, selectedGroups, toggleGroup} = props;

  // Handel toggle switch
  const handleCheck = (e) => {
    toggleGroup(e.target.value);
  };

  // Create switches group
  const switches = groups.map((option) => {
    return (
      <FormControlLabel key={option.id} label={option.text}
        control={
          <Switch key={option.id} color="primary"
            checked={_.includes(selectedGroups, option.id)}
            onChange={handleCheck} value={option.id}
          />}
      />
    );
  });

  return (
    <FormGroup row>
      {switches}
    </FormGroup>
  );
};

ChartSubgroupsFilter.propTypes = {
  groups: PropTypes.array,
  selectedGroups: PropTypes.array,
  toggleGroup: PropTypes.func,
};


export default ChartSubgroupsFilter;
