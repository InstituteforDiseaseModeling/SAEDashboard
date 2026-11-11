
/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import {changeSelectedMonth} from '../../redux/actions/filters';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';

const LABEL_FONT = '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif';

// component styles — GF-styled dropdown, matching CountryFilter
const styles = {
  // Spacing comes from the CountryFilter row this sits in.
  root: {},
  formControl: {
    minWidth: 130,
  },
  inputLabel: {
    fontFamily: LABEL_FONT,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#313A44 !important',
    transform: 'translate(0, -4px) scale(1)',
  },
  select: {
    'fontFamily': LABEL_FONT,
    'fontSize': 15,
    'fontWeight': 500,
    'color': '#313A44',
    '&:before': {
      borderBottom: '1px solid rgba(49, 58, 68, 0.25)',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: '2px solid #313A44',
    },
    '&:after': {
      borderBottom: '2px solid #313A44',
    },
  },
  menuPaper: {
    maxHeight: 400,
    borderRadius: 4,
    marginTop: 4,
    boxShadow: '0 6px 24px rgba(49, 58, 68, 0.18)',
  },
};

/**
 * component for month selection
 * @param {MonthFilter.propTypes} props
 * @return {React.ReactElement}
 */
const MonthFilter = (props) => {
  const {classes} = props;

  const dispatch = useDispatch();
  const currentMonth = useSelector((state) => state.filters.currentMonth);
  const indicators = useSelector((state) => state.filters.indicators);
  const primaryIndicator = useSelector((state) => state.filters.selectedIndicator);
  const currentYear = useSelector((state) => state.filters.currentYear);

  const [currentMonthLocal, changeMonthLocal] = useState(currentMonth);

  const customMarks = [
    { value: 0, label: props.intl.formatMessage({ id: 'month-All' }) },
    { value: 1, label: props.intl.formatMessage({ id: 'month-Jan' }) },
    { value: 2, label: props.intl.formatMessage({ id: 'month-Feb' }) },
    { value: 3, label: props.intl.formatMessage({ id: 'month-Mar' }) },
    { value: 4, label: props.intl.formatMessage({ id: 'month-Apr' }) },
    { value: 5, label: props.intl.formatMessage({ id: 'month-May' }) },
    { value: 6, label: props.intl.formatMessage({ id: 'month-Jun' }) },
    { value: 7, label: props.intl.formatMessage({ id: 'month-Jul' }) },
    { value: 8, label: props.intl.formatMessage({ id: 'month-Aug' }) },
    { value: 9, label: props.intl.formatMessage({ id: 'month-Sep' }) },
    { value: 10, label: props.intl.formatMessage({ id: 'month-Oct' }) },
    { value: 11, label: props.intl.formatMessage({ id: 'month-Nov' }) },
    { value: 12, label: props.intl.formatMessage({ id: 'month-Dec' }) },
  ];
  const [localMarks, setLocalMarks] = useState(customMarks);

  useEffect(() => {
    const indicatorInfo = indicators.find((indicator) => indicator.id === primaryIndicator);

    if (indicatorInfo && currentYear) {
      const yearInfo = indicatorInfo.time[currentYear];
      if (!yearInfo) {
        return;
      }

      for (let i = 1; i <= 12; i++) {
        if (yearInfo && !yearInfo.includes(i)) {
          customMarks[i].label = '';
        }
      }
      const newMarks = customMarks.filter((mark) => {
        return mark.label !== '';
      });

      setLocalMarks(newMarks);
    };
  }, [indicators, primaryIndicator, currentYear]);

  const handleChange = (event) => {
    const value = event.target.value;
    changeMonthLocal(value);
    dispatch(changeSelectedMonth(value));
  };

  const selectValue = localMarks.some((m) => m.value === currentMonthLocal) ?
    currentMonthLocal : 0;

  return (
    <div className={classes.root}>
      <FormControl variant="standard" className={classes.formControl}>
        <InputLabel
          className={classes.inputLabel}
          shrink
          sx={{color: '#313A44 !important'}}
          htmlFor="month-select">
          Month
        </InputLabel>
        <Select
          id="month-select"
          variant="standard"
          value={selectValue}
          onChange={handleChange}
          className={classes.select}
          MenuProps={{classes: {paper: classes.menuPaper}}}
        >
          {localMarks.map((mark) => (
            <MenuItem value={mark.value} key={mark.value}>{mark.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

MonthFilter.propTypes = {
  intl: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(MonthFilter));
