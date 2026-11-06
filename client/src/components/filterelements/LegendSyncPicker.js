import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Switch, FormControl, FormLabel, FormControlLabel, Typography} from '@mui/material';
import {changeLegendSync} from '../../redux/actions/filters';
import {FormattedMessage} from 'react-intl';
import {toolbarFormLabelSx, toolbarSwitchSx, toolbarSwitchLabelSx} from './controlStyles';

/**
 * Toggle for syncing legends between the primary and comparison maps.
 * @return {React.ReactElement}
 */
const LegendSyncPicker = () => {
  const dispatch = useDispatch();
  const selectedLegendSync = useSelector((state) => state.filters.selectedLegendSync);

  return (
    <div style={{minWidth: 100}}>
      <FormControl component='fieldset' variant='standard'>
        <FormLabel component='legend' sx={toolbarFormLabelSx}>
          <FormattedMessage id='Legend_Sync'/>
        </FormLabel>
        <FormControlLabel
          sx={{marginLeft: 0, marginTop: '2px', gap: '8px'}}
          label={
            <Typography sx={toolbarSwitchLabelSx}>
              {selectedLegendSync ? 'On' : 'Off'}
            </Typography>
          }
          control={<Switch
            sx={toolbarSwitchSx}
            checked={selectedLegendSync}
            onChange={(e) => dispatch(changeLegendSync(e.target.checked))}
          />}
        />
      </FormControl>
    </div>
  );
};

export default LegendSyncPicker;
