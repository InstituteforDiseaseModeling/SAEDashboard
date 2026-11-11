import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Switch, FormControl, FormLabel, FormControlLabel, Typography} from '@mui/material';
import {changeDiffMap} from '../../redux/actions/filters';
import {FormattedMessage} from 'react-intl';
import {toolbarFormLabelSx, toolbarSwitchSx, toolbarSwitchLabelSx} from './controlStyles';

/**
 * Toggle for showing the comparison map as a difference layer.
 * @return {React.ReactElement}
 */
const DiffMapPicker = () => {
  const dispatch = useDispatch();
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);

  return (
    <div style={{minWidth: 90}}>
      <FormControl component='fieldset' variant='standard'>
        <FormLabel component='legend' sx={toolbarFormLabelSx}>
          <FormattedMessage id='difference'/>
        </FormLabel>
        <FormControlLabel
          sx={{marginLeft: 0, marginTop: '2px', gap: '8px'}}
          label={
            <Typography sx={toolbarSwitchLabelSx}>
              {selectedDiffMap ? 'On' : 'Off'}
            </Typography>
          }
          control={<Switch
            sx={toolbarSwitchSx}
            checked={selectedDiffMap}
            onChange={(e) => dispatch(changeDiffMap(e.target.checked))}
          />}
        />
      </FormControl>
    </div>
  );
};

export default DiffMapPicker;
