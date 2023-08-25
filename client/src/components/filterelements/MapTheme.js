import React, {useEffect} from 'react';
import {MenuItem, Select} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import withStyles from '@mui/styles/withStyles';
import config from '../../app_config.json';
import {DEFAULT_THEME} from '../../const';
import PropTypes from 'prop-types';


const styles = {
  menuPaper: {
    maxHeight: 400,
  },
};

const scales = [
  'Accent', 'Blues', 'BrBG', 'BuGn', 'BuPu', 'BuRd', 'Dark2', 'GnBu', 'Greens',
  'Greys', 'OrRd', 'Oranges', 'PRGn', 'Paired', 'Pastel1', 'Pastel2', 'PiYG',
  'PuBu', 'PuBuGn', 'PuOr', 'PuRd', 'Purples', 'RdBu', 'RdGy', 'RdPu', 'RdYlBu',
  'RdYlGn', 'Reds', 'Set1', 'Set2', 'Set3', 'Spectral', 'Viridis', 'YlGn', 'YlGnBu',
  'YlOrBr', 'YlOrRd', 'GnRd',
];

/**
 * component for color theme selection for the map chart
 * @param {MapTheme.propTypes} props
 * @return {React.ReactElement}
 */
const MapTheme = (props) => {
  const {selectedMapTheme, changeMapTheme, classes, indicator} = props;

  useEffect(()=> {
    if (!selectedMapTheme) {
      changeMapTheme(indicator && config &&
        config.defaultThemeByIndicator && config.defaultThemeByIndicator[indicator] ?
        onfig.defaultThemeByIndicator[indicator] : DEFAULT_THEME);
    }
  }, []);

  useEffect(() => {
    changeMapTheme(indicator && config && config.defaultThemeByIndicator &&
      config.defaultThemeByIndicator[indicator] ?
      config.defaultThemeByIndicator[indicator] : DEFAULT_THEME);
  }, [indicator]);

  useEffect(() => {
    changeMapTheme(selectedMapTheme);
  }, [selectedMapTheme]);

  return (
    <FormControl variant="standard">
      <InputLabel htmlFor="mapTheme-select">Themes</InputLabel>
      <Select id="mapTheme-select" value={selectedMapTheme ? selectedMapTheme : scales[0]}
        style={{minWidth: '100px'}}
        onChange={(e) => changeMapTheme(e.target.value)}
        MenuProps={{classes: {paper: classes.menuPaper}}}
      >
        {scales.map((field, i) => {
          return (<MenuItem value={field} key={i}>{field}</MenuItem>);
        })}
      </Select>
    </FormControl>);
};

MapTheme.propTypes = {
  classes: PropTypes.object,
  selectedMapTheme: PropTypes.string,
  changeMapTheme: PropTypes.func,
  indicator: PropTypes.string,
};

export default withStyles(styles)(MapTheme);
