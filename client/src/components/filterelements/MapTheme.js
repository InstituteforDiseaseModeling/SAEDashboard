import React, {useEffect} from 'react';
import {MenuItem, Select} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {useSelector} from 'react-redux';
import config from '../../app_config.json';
import {DEFAULT_THEME, MAP_THEMES} from '../../const';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {toolbarLabelSx, toolbarSelectSx, toolbarMenuPaperSx} from './controlStyles';

const MapTheme = (props) => {
  const {primary, selectedMapTheme, selectedComparisonMapTheme, changeMapTheme,
    changeComparisonMapTheme, indicator} = props;
  const indicators = useSelector((state) => state.filters.indicators);

  const getThemeForIndicator = (ind) => {
    if (ind && config && config.defaultThemeByIndicator && config.defaultThemeByIndicator[ind]) {
      return config.defaultThemeByIndicator[ind];
    }
    const indObj = indicators.find((i) => i.id === ind);
    if (indObj && indObj.color_theme) return indObj.color_theme;
    return DEFAULT_THEME;
  };

  useEffect(()=> {
    if (!selectedMapTheme) {
      changeMapTheme(getThemeForIndicator(indicator));
    }
    if (!selectedComparisonMapTheme) {
      changeComparisonMapTheme(getThemeForIndicator(indicator));
    }
  }, []);

  useEffect(() => {
    if (primary) {
      changeMapTheme(getThemeForIndicator(indicator));
    } else {
      changeComparisonMapTheme(getThemeForIndicator(indicator));
    }
  }, [indicator, indicators]);

  useEffect(() => {
    changeMapTheme(selectedMapTheme);
  }, [selectedMapTheme]);

  useEffect(() => {
    if (selectedComparisonMapTheme) {
      changeComparisonMapTheme(selectedComparisonMapTheme);
    };
  }, [selectedComparisonMapTheme]);

  const renderSelect = (value, onChange) => (
    <Select
      id="mapTheme-select"
      value={value || MAP_THEMES[0]}
      sx={{...toolbarSelectSx, minWidth: 110}}
      MenuProps={{PaperProps: {sx: toolbarMenuPaperSx}}}
      onChange={(e) => onChange(e.target.value)}
    >
      {MAP_THEMES.map((field, i) => (
        <MenuItem value={field} key={i}>{field}</MenuItem>
      ))}
    </Select>
  );

  return (
    <FormControl variant="standard">
      <InputLabel shrink htmlFor="mapTheme-select" sx={toolbarLabelSx}>
        <FormattedMessage id='themes'/>
      </InputLabel>
      {primary ?
        renderSelect(selectedMapTheme, changeMapTheme) :
        renderSelect(selectedComparisonMapTheme, changeComparisonMapTheme)
      }
    </FormControl>);
};

MapTheme.propTypes = {
  primary: PropTypes.bool,
  classes: PropTypes.object,
  selectedMapTheme: PropTypes.string,
  selectedComparisonMapTheme: PropTypes.string,
  changeMapTheme: PropTypes.func,
  changeComparisonMapTheme: PropTypes.func,
  indicator: PropTypes.string,
};

export default MapTheme;
