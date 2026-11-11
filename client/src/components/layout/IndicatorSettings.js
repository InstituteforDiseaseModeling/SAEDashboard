import React, {useEffect, useState} from 'react';
import {
  Box, FormControl, Select, MenuItem, TextField,
  Switch, Typography, Button, Stack, Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {useDispatch, useSelector} from 'react-redux';
import {useAppConfig, useIndicatorsConfig} from '../../hooks/useAppConfig.ts';
import {updateIndicatorConfig} from '../../redux/actions/config';
import {changeIndicatorColorTheme} from '../../redux/actions/filters';
import {MAP_THEMES} from '../../const';

const META_FIELDS = [
  {key: 'theme', label: 'Map theme', type: 'select',
    options: [
      {value: '', label: '(default)'},
      ...MAP_THEMES.map((theme) => ({value: theme, label: theme})),
    ],
    description: 'Default color theme for the map.'},
  {key: 'shapefileVersion', label: 'Shapefile version', type: 'number',
    description: 'Shape file version used to fetch the matching geometry.'},
  {key: 'unitLabel', label: 'Unit label', type: 'text',
    description: 'Message id describing the metric/unit.'},
  {key: 'multiper', label: 'Multiplier', type: 'number',
    description: 'Scalar multiplier applied to raw values before display.'},
  {key: 'unit', label: 'Unit suffix', type: 'text',
    description: 'Suffix appended after formatted numbers.'},
  {key: 'mapLabel', label: 'Map label', type: 'text',
    description: 'Message id for the label shown in the map popup tooltip.'},
  {key: 'decimalPt', label: 'Decimal places', type: 'number',
    description: 'Number of decimal places to round the displayed value to.'},
  {key: 'legendLabel', label: 'Legend label', type: 'text',
    description: 'Message id for the title/label shown on the map popup message.'},
  {key: 'useAvg', label: 'Use average', type: 'boolean',
    description: 'When true, the map combines values using an average.'},
  {key: 'mainSpeciesName', label: 'Main series name', type: 'text',
    description: 'Primary series name shown in bar/stacked-bar charts.'},
  {key: 'rasterFile', label: 'Raster overlay file', type: 'text',
    description: 'Path to a raster PNG overlay laid over the map.'},
  {key: 'extraInfo', label: 'Show extra info', type: 'boolean',
    description: 'When true, renders the extra-info UI on the map.'},
  {key: 'extraInfoEn', label: 'Extra info (English)', type: 'textarea',
    description: 'Text of the map extra-info tooltip in English.'},
  {key: 'extraInfoFr', label: 'Extra info (French)', type: 'textarea',
    description: 'Text of the map extra-info tooltip in French.'},
  {key: 'chartType', label: 'Chart type', type: 'select',
    options: [
      {value: '', label: 'line'},
      {value: 'bar', label: 'bar'},
      {value: 'stackBar', label: 'stackBar'},
    ],
    description: 'Chart variant used by StateDataChart.'},
  {key: 'yAxisLabel', label: 'Y-axis label', type: 'text',
    description: 'Message id for the y-axis label on bar/stacked-bar charts.'},
  {key: 'ignoreOthers', label: 'Ignore others series', type: 'boolean',
    description: 'When true, the line chart suppresses the synthetic "others" series.'},
  {key: 'dataSourceEn', label: 'Data source (English)', type: 'text',
    description: 'Data source shown under the map in English.'},
  {key: 'dataSourceFr', label: 'Data source (French)', type: 'text',
    description: 'Data source shown under the map in French.'},
  {key: 'group', label: 'Indicator group', type: 'select', options: null,
    description: 'Section the indicator is listed under in the indicator dropdown.'},
  {key: 'groupOrder', label: 'Group order', type: 'number',
    description: 'Sort position of the indicator within its group.'},
];

const SERVICE_BASE = '/api';

const IndicatorSettings = () => {
  const dispatch = useDispatch();
  const indicatorsConfig = useIndicatorsConfig();
  const configuredGroups = useAppConfig().indicatorGroups || [];
  const liveIndicators = useSelector((state) => state.filters.indicators);
  const liveIds = new Set((liveIndicators || []).map((ind) => ind.id));
  const indicatorEntries = Object.entries(indicatorsConfig || {})
      .filter(([id]) => liveIds.has(id))
      .map(([id, meta]) => ({id, legendLabel: meta?.legendLabel}))
      .sort((a, b) => a.id.localeCompare(b.id));

  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const storedConfig = indicatorsConfig[selectedIndicator];

  useEffect(() => {
    setFormValues(storedConfig ? {...storedConfig} : {});
  }, [selectedIndicator, storedConfig]);

  const handleFieldChange = (key, value) => {
    setFormValues((prev) => ({...prev, [key]: value}));
    setStatus(null);
  };

  const isDirty = selectedIndicator &&
    JSON.stringify(formValues) !== JSON.stringify(storedConfig || {});

  const buildPayload = () => {
    const payload = {};
    for (const field of META_FIELDS) {
      const value = formValues[field.key];
      if (field.type === 'boolean') {
        payload[field.key] = Boolean(value);
      } else {
        payload[field.key] =
          (value === '' || value === undefined) ? null : value;
      }
    }
    return payload;
  };

  const handleSave = async () => {
    if (!selectedIndicator || saving) return;
    setSaving(true);
    setStatus(null);
    try {
      const resp = await fetch(
          `/mind/config/indicators/` +
            encodeURIComponent(selectedIndicator),
          {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(buildPayload()),
          },
      );
      const body = await resp.json().catch(() => null);
      if (!resp.ok) {
        const detail = body && body.detail;
        throw new Error(
            typeof detail === 'string' ? detail : `Save failed (${resp.status})`,
        );
      }
      dispatch(updateIndicatorConfig(selectedIndicator, body));
      const savedTheme = (body && body.theme) || null;
      if (savedTheme !== (storedConfig?.theme ?? null)) {
        dispatch(changeIndicatorColorTheme(selectedIndicator, savedTheme));
      }
      setStatus({ok: true, msg: 'Saved.'});
    } catch (err) {
      setStatus({ok: false, msg: err.message || 'Save failed.'});
    } finally {
      setSaving(false);
    }
  };

  const storedGroup = formValues.group;
  const groupOptions = [
    {value: '', label: '(none)'},
    ...configuredGroups.map((group) => ({value: group, label: group})),
    ...(storedGroup && !configuredGroups.includes(storedGroup) ?
      [{value: storedGroup, label: storedGroup}] : []),
  ];

  const renderControl = (field) => {
    const value = formValues[field.key];
    const options = field.key === 'group' ? groupOptions : field.options;

    if (field.type === 'boolean') {
      return (
        <Switch
          checked={Boolean(value)}
          onChange={(e) => handleFieldChange(field.key, e.target.checked)}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <FormControl size="small" fullWidth>
          <Select
            value={value ?? ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        size="small"
        fullWidth
        type={field.type === 'number' ? 'number' : 'text'}
        multiline={field.type === 'textarea'}
        minRows={field.type === 'textarea' ? 3 : undefined}
        value={value ?? ''}
        onChange={(e) => handleFieldChange(
            field.key,
            field.type === 'number' ?
              (e.target.value === '' ? '' : Number(e.target.value)) :
              e.target.value,
        )}
      />
    );
  };

  const renderField = (field) => {
    return (
      <Box
        key={field.key}
        sx={{display: 'flex', alignItems: 'center', gap: 2}}
      >
        <Box sx={{
          width: 200, flexShrink: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end', gap: 0.5,
        }}>
          <Typography variant="body2">{field.label}</Typography>
          <Tooltip title={field.description} arrow>
            <InfoOutlinedIcon
              fontSize="small"
              sx={{color: 'text.secondary', cursor: 'help'}}
            />
          </Tooltip>
        </Box>
        <Box sx={{flexGrow: 1}}>
          {renderControl(field)}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2, maxWidth: 560, mb: 3,
      }}>
        <Typography
          variant="body2"
          sx={{width: 200, flexShrink: 0, textAlign: 'right'}}
        >
          Indicator
        </Typography>
        <FormControl size="small" sx={{flexGrow: 1}}>
          <Select
            displayEmpty
            value={selectedIndicator}
            onChange={(e) => {
              setSelectedIndicator(e.target.value);
              setStatus(null);
            }}
          >
            <MenuItem value="" disabled>
              Select an indicator
            </MenuItem>
            {indicatorEntries.length === 0 && (
              <MenuItem disabled value="__none__">
                No indicators available
              </MenuItem>
            )}
            {indicatorEntries.map((entry) => (
              <MenuItem key={entry.id} value={entry.id}>
                <Box sx={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', width: '100%', gap: 2,
                }}>
                  <span>{entry.id}</span>
                  <Typography variant="caption" color="textSecondary" noWrap>
                    {entry.legendLabel || ''}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {!selectedIndicator && (
        <Typography variant="body2" color="textSecondary">
          Select an indicator to view and edit its metadata.
        </Typography>
      )}

      {selectedIndicator && (
        <>
          <Stack spacing={2} sx={{maxWidth: 560}}>
            {META_FIELDS.map(renderField)}
          </Stack>
          <Box sx={{mt: 3, display: 'flex', alignItems: 'center', gap: 2}}>
            <Button
              variant="contained"
              disabled={!isDirty || saving}
              onClick={handleSave}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
            {status && (
              <Typography
                variant="body2"
                color={status.ok ? 'success.main' : 'error.main'}
              >
                {status.msg}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default IndicatorSettings;
