import React from 'react';
import {useSelector} from 'react-redux';
import {MenuItem, Select} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

/**
 * component for subgroup selection in the map chart
 * @param {MapSubgroupsFilter.propTypes} props
 * @return {React.ReactElement}
 */
const MapSubgroupsFilter = (props) => {
  const {selectedSubgroup, changeSubgroup} = props;
  const subGroups = useSelector((state) => state.filters.mapSubgroups);

  return (
    <FormControl variant="standard">
      <InputLabel htmlFor="mapsubgroup-select">
        <FormattedMessage id='subgroups'/>
      </InputLabel>
      <Select id="mapsubgroup-select" value={selectedSubgroup || ''}
        onChange={(e) => changeSubgroup(e.target.value)}>
        {subGroups.map((field, i) => {
          return (
            <MenuItem value={field.id} key={i}>
              <FormattedMessage id={field.text}/>
            </MenuItem>);
        })}
      </Select>
    </FormControl>
  );
};

MapSubgroupsFilter.propTypes = {
  selectedSubgroup: PropTypes.string,
  changeSubgroup: PropTypes.func,
};

export default MapSubgroupsFilter;
