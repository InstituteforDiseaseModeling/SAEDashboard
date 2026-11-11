import React from 'react'; // eslint-disable-line no-unused-vars
import {useSelector} from 'react-redux';
import {MenuItem, Select} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {toolbarLabelSx, toolbarSelectSx, toolbarMenuPaperSx} from './controlStyles';

/**
 * component for subgroup selection in the map chart
 * @param {MapSubgroupsFilter.propTypes} props
 * @return {React.ReactElement}
 */
const MapSubgroupsFilter = (props) => {
  const {selectedSubgroup, changeSubgroup, selectedIndicator, primary} = props;
  const indicators = useSelector((state) => state.filters.indicators);
  const indicatorObj = _.find(indicators, {id: selectedIndicator ? selectedIndicator : ''});
  const subgroups = indicatorObj?.subgroups || [];

  return (
    <FormControl variant="standard" sx={{minWidth: 110}}>
      <InputLabel shrink htmlFor="mapsubgroup-select" sx={toolbarLabelSx}>
        <FormattedMessage id='subgroups'/>
      </InputLabel>
      <Select id="mapsubgroup-select" value={selectedSubgroup || ''}
        sx={toolbarSelectSx}
        MenuProps={{PaperProps: {sx: toolbarMenuPaperSx}}}
        onChange={(e) => changeSubgroup(primary, e.target.value)}>
        {subgroups.map((field, i) => {
          return (
            <MenuItem value={field} key={i}>
              <FormattedMessage id={field}/>
            </MenuItem>);
        })}
      </Select>
    </FormControl>
  );
};

MapSubgroupsFilter.propTypes = {
  selectedSubgroup: PropTypes.string,
  changeSubgroup: PropTypes.func,
  selectedIndicator: PropTypes.string.isRequired,
  primary: PropTypes.bool,
};

export default MapSubgroupsFilter;
