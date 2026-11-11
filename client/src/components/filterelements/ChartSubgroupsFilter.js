import React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';

export const CHART_TYPES = ['', 'line', 'bar', 'stackBar'];

const sectionTitleSx = {
  display: 'block',
  marginBottom: '4px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'text.secondary',
};

const optionRowSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  minHeight: 36,
};

const ChartSubgroupsFilter = (props) => {
  const {groups, selectedGroups, toggleGroup, combineGroups, onCombineGroupsChange,
    syncYAxis, onSyncYAxisChange, chartType, onChartTypeChange} = props;
  const t = (id) => props.intl.messages[id] ? props.intl.formatMessage({id}) : id;

  const handleCheck = (e) => {
    toggleGroup(e.target.value);
  };

  const switches = groups.map((option) => {
    return (
      <FormControlLabel key={option} label={t(option)}
        control={
          <Switch key={option} color="primary"
            checked={_.includes(selectedGroups, option)}
            onChange={handleCheck} value={option}
          />}
      />
    );
  });

  const optionSwitch = (label, checked, onChange) => (
    <Box sx={optionRowSx}>
      <Typography variant="body2">{label}</Typography>
      <Switch size="small" color="secondary" checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
        inputProps={{'aria-label': label}}/>
    </Box>
  );

  const hasOptions = onCombineGroupsChange || onSyncYAxisChange || onChartTypeChange;

  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 2, textAlign: 'left'}}>
      <Box sx={{flex: 1, minWidth: 0}}>
        <Typography variant="caption" sx={sectionTitleSx}>{t('subgroups')}</Typography>
        <FormGroup row>
          {switches}
        </FormGroup>
      </Box>
      {hasOptions &&
        <Box sx={{width: 230, flexShrink: 0, padding: '8px 12px', borderRadius: 1,
          backgroundColor: 'var(--parchment)', border: '1px solid var(--parchment-dark)'}}>
          <Typography variant="caption" sx={sectionTitleSx}>{t('display_options')}</Typography>
          {onCombineGroupsChange &&
            optionSwitch(t('combine_subgroups'), combineGroups, onCombineGroupsChange)}
          {onSyncYAxisChange &&
            optionSwitch(t('sync_y_axis'), syncYAxis, onSyncYAxisChange)}
          {onChartTypeChange &&
            <Box sx={optionRowSx}>
              <Typography variant="body2">{t('chart_type')}</Typography>
              <Select size="small" variant="standard" displayEmpty
                value={chartType || ''}
                onChange={(e) => onChartTypeChange(e.target.value)}
                inputProps={{'aria-label': t('chart_type')}}
                sx={{minWidth: 110, fontSize: '0.875rem'}}
              >
                {CHART_TYPES.map((type) => (
                  <MenuItem key={type} value={type} dense>
                    {t('chart_type_' + (type || 'default'))}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          }
        </Box>
      }
    </Box>
  );
};

ChartSubgroupsFilter.propTypes = {
  groups: PropTypes.array,
  selectedGroups: PropTypes.array,
  toggleGroup: PropTypes.func,
  combineGroups: PropTypes.bool,
  onCombineGroupsChange: PropTypes.func,
  syncYAxis: PropTypes.bool,
  onSyncYAxisChange: PropTypes.func,
  chartType: PropTypes.string,
  onChartTypeChange: PropTypes.func,
  intl: PropTypes.func,
};


export default injectIntl(ChartSubgroupsFilter);
