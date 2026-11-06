/* eslint-disable no-unused-vars */
import React from 'react';
import {useSelector} from 'react-redux';
import {ListSubheader, MenuItem, Select} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {makeStyles} from '@mui/styles';
import * as _ from 'lodash';
import {useAppConfig, useIndicatorsConfig} from '../../hooks/useAppConfig.ts';
import {toolbarLabelSx, toolbarSelectSx, toolbarMenuPaperSx} from './controlStyles';

// Section for indicators whose config has no `group`.
const OTHER_GROUP = 'Other';

const styles = makeStyles({
  menuItem: {
    paddingLeft: '30px',
    lineHeight: '15px',
  },
  subHeader: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: '0.08em',
    color: '#F5F3ED',
    backgroundColor: '#313A44',
    lineHeight: '30px',
  },
  duplicate: {
    opacity: 0.6,
    fontSize: '0.85em',
    marginLeft: 6,
  },
});

/**
 * Group the indicators available for the current country by the `group`
 * field of their /config entry, ordered by `groupOrder` (then label) within
 * each section. Indicators without a `group` go into OTHER_GROUP.
 * @param {Object[]} indicators - state.filters.indicators
 * @param {Object} indicatorsConfig - state.config.indicators
 * @return {Object<string, Object[]>} group -> ordered indicator entries
 */
const buildIndicatorGroupMap = (indicators, indicatorsConfig) => {
  const map = {};
  for (const indicator of indicators || []) {
    const meta = (indicatorsConfig || {})[indicator.id] || {};
    const group = meta.group || OTHER_GROUP;
    if (!map[group]) map[group] = [];
    map[group].push({...indicator, order: meta.groupOrder ?? 0});
  }
  for (const group of Object.keys(map)) {
    map[group] = _.sortBy(map[group], ['order', 'text']);
  }
  return map;
};

/**
 * component for indicator selection
 * @param {IndicatorFilter.propTypes} props
 * @return {React.ReactElement}
 */
const IndicatorFilter = (props) => {
  const {selectedIndicator, changeIndicator, changeIsAdm3, primary} = props;
  const indicators = useSelector((state) => state.filters.indicators);
  const selectedIsAdm3 = useSelector((state) => state.filters.isAdm3);
  const appConfig = useAppConfig();
  const indicatorsConfig = useIndicatorsConfig();
  const classes = styles();

  const textCounts = _.countBy(indicators, 'text');
  const duplicateTexts = new Set(
      Object.keys(textCounts).filter((t) => textCounts[t] > 1),
  );

  const configuredGroups = appConfig.indicatorGroups || [];
  const groupedIndicators = buildIndicatorGroupMap(indicators, indicatorsConfig);
  // Groups used by indicators but missing from the configured order (e.g.
  // custom categories) are appended alphabetically so their indicators are
  // never dropped; OTHER_GROUP always comes last.
  const extraGroups = Object.keys(groupedIndicators)
      .filter((group) => !configuredGroups.includes(group) && group !== OTHER_GROUP)
      .sort();
  const groupOrder = [...configuredGroups, ...extraGroups, OTHER_GROUP];
  // Headers only help once something is grouped; otherwise show a flat list.
  const showHeaders = Object.keys(groupedIndicators).some((g) => g !== OTHER_GROUP);

  // Render each group as a (ListSubheader, ...MenuItem[]) sequence flattened
  // into a single children array. MUI Select requires direct MenuItem children
  // (not wrapped in fragments) so it can resolve the value→label mapping.
  const renderMenu = () => {
    const children = [];
    for (const group of groupOrder) {
      const entries = groupedIndicators[group];
      if (!entries || entries.length === 0) continue;
      if (showHeaders) {
        children.push(
            <ListSubheader key={`hdr-${group}`} className={classes.subHeader}>
              <FormattedMessage id={group} defaultMessage={group}/>
            </ListSubheader>,
        );
      }
      for (const entry of entries) {
        children.push(
            <MenuItem key={entry.id} value={entry.id}
              className={showHeaders ? classes.menuItem : undefined}>
              {entry.text}
              {duplicateTexts.has(entry.text) && (
                <span className={classes.duplicate}>
                  ({entry.id})
                </span>
              )}
            </MenuItem>,
        );
      }
    }
    return children;
  };

  return (
    <FormControl variant="standard" sx={{minWidth: 140}}>
      <InputLabel shrink htmlFor="indicator-select" sx={toolbarLabelSx}>
        <FormattedMessage id='indicators'/>
      </InputLabel>
      <Select id="indicator-select" value={selectedIndicator || ''}
        sx={toolbarSelectSx}
        MenuProps={{PaperProps: {sx: toolbarMenuPaperSx}}}
        onChange={(e) => {
          const _indicator = e.target.value;
          const indicatorInfo = indicators.find((indicator) => indicator.id === _indicator);
          if (indicatorInfo) {
            const adminLevel = selectedIsAdm3 ? 2 : 1;
            if (!indicatorInfo.admin_levels.includes(adminLevel) && primary) {
              changeIsAdm3(!selectedIsAdm3);
            }
          }
          changeIndicator(_indicator);
        }}
      >
        {renderMenu()}
      </Select>
    </FormControl>);
};

IndicatorFilter.propTypes = {
  selectedIndicator: PropTypes.string,
  changeIndicator: PropTypes.func,
  changeIsAdm3: PropTypes.func,
  primary: PropTypes.bool,
};

export default IndicatorFilter;
