import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Switch, FormControl, FormLabel, FormControlLabel, Typography} from '@mui/material';
import {changeSelectedLegend} from '../../redux/actions/filters';
import {FormattedMessage} from 'react-intl';
import {toolbarFormLabelSx, toolbarSwitchSx, toolbarSwitchLabelSx} from './controlStyles';

/**
 * Switch between equal-interval and custom legend bucketing.
 * @return {React.ReactElement}
 */
const LegendPicker = () => {
  const dispatch = useDispatch();
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);

  return (
    <div style={{minWidth: 180}}>
      <FormControl component='fieldset' variant='standard'>
        <FormLabel component='legend' sx={toolbarFormLabelSx}>
          <FormattedMessage id='legend'/>
        </FormLabel>
        <FormControlLabel
          sx={{marginLeft: 0, marginTop: '2px', gap: '8px'}}
          label={
            <Typography sx={toolbarSwitchLabelSx}>
              {selectedLegend ?
                <FormattedMessage id='equal_interval'/> :
                <FormattedMessage id='custom_legend'/>}
            </Typography>
          }
          control={<Switch
            sx={toolbarSwitchSx}
            checked={selectedLegend}
            onChange={(e) => dispatch(changeSelectedLegend(e.target.checked))}
          />}
        />
      </FormControl>
    </div>
  );
};

export default LegendPicker;
