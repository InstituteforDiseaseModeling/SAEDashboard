import React, {useState} from 'react';
import {
  Box, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  RadioGroup, Radio, FormControlLabel, FormLabel, Checkbox, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  inputLabel: {
    fontSize: '0.85rem',
    color: 'grey!important',
  },
});

const ChatFormRenderer = ({form, onSubmit, disabled, classes}) => {
  const [values, setValues] = useState(() => {
    const init = {};
    (form.fields || []).forEach((f) => {
      const d = f.default;
      const hasDefault = d != null && d !== '';
      if (hasDefault) {
        init[f.name] = d;
      } else if (f.type === 'checkbox') {
        init[f.name] = false;
      } else if ((f.type === 'select' || f.type === 'radio') && f.options?.length) {
        init[f.name] = f.options[0];
      } else {
        init[f.name] = '';
      }
    });
    return init;
  });

  const handleChange = (name, val) => {
    setValues((prev) => ({...prev, [name]: val}));
  };

  const getFieldError = (field) => {
    const val = values[field.name];
    if (!val && !field.required) return null;
    if (field.validation) {
      try {
        if (val && !new RegExp(field.validation.pattern).test(val)) {
          return field.validation.message || 'Invalid value';
        }
      } catch (e) {/* ignore bad regex */}
    }
    return null;
  };

  const allValid = (form.fields || []).every((f) => {
    const v = values[f.name];
    if (f.type === 'checkbox') return true;
    const filled = v != null && v !== '';
    if (f.required && f.type !== 'textarea' && !filled) return false;
    if (getFieldError(f)) return false;
    return true;
  });

  const handleSubmit = () => {
    onSubmit({form_id: form.id, values});
  };

  const renderField = (field) => {
    const val = values[field.name];
    const error = getFieldError(field);
    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small" key={field.name} sx={{mb: 1.5}}
            disabled={disabled} title={field.label}>
            <InputLabel className={classes.inputLabel} shrink>{field.label}</InputLabel>
            <Select
              value={val}
              label={field.label}
              displayEmpty
              notched
              onChange={(e) => handleChange(field.name, e.target.value)}
              renderValue={(selected) => selected ||
                <span style={{color: '#aaa'}}>{field.placeholder || ''}</span>}
              MenuProps={{sx: {zIndex: 10001}}}
            >
              {(field.options || []).map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            {field.helperText && (
              <Typography variant="caption" color="textSecondary" sx={{mt: 0.25, ml: 1.5}}>
                {field.helperText}
              </Typography>
            )}
          </FormControl>
        );
      case 'radio':
        return (
          <FormControl key={field.name} sx={{mb: 1.5}} disabled={disabled} title={field.label}>
            <FormLabel className={classes.inputLabel}>{field.label}</FormLabel>
            <RadioGroup
              value={val}
              onChange={(e) => handleChange(field.name, e.target.value)}
              row={field.options && field.options.length <= 4}
            >
              {(field.options || []).map((opt) => (
                <FormControlLabel className={classes.inputLabel} key={opt} value={opt}
                  control={<Radio size="small" />} label={opt} />
              ))}
            </RadioGroup>
            {field.helperText && (
              <Typography variant="caption" color="textSecondary" sx={{ml: 1.5}}>
                {field.helperText}
              </Typography>
            )}
          </FormControl>
        );
      case 'textarea':
        return (
          <TextField
            key={field.name}
            fullWidth size="small"
            multiline minRows={2} maxRows={4}
            label={field.label}
            title={field.label}
            placeholder={field.placeholder}
            value={val}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error || field.helperText}
            disabled={disabled}
            sx={{'mb': 1.5, '& label': {color: 'grey !important'}}}
          />
        );
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.name}
            title={field.label}
            className={classes.inputLabel}
            control={
              <Checkbox
                size="small"
                checked={!!val}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                disabled={disabled}
              />
            }
            label={field.label}
            sx={{mb: 1}}
          />
        );
      default:
        return (
          <TextField
            key={field.name}
            fullWidth size="small"
            label={field.label}
            title={field.label}
            placeholder={field.placeholder}
            value={val}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error || field.helperText}
            disabled={disabled}
            sx={{'mb': 1.5, '& label': {color: 'grey !important'}}}
          />
        );
    }
  };

  return (
    <Box sx={{
      mt: 1, p: 1.5, backgroundColor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0',
    }}>
      {form.title && <Typography variant="subtitle2" sx={{mb: 1}}>{form.title}</Typography>}
      {(form.fields || []).map(renderField)}
      {!disabled && (
        <Button
          variant="contained" size="small" fullWidth
          onClick={handleSubmit}
          disabled={!allValid}
          sx={{mt: 0.5}}
        >
          {form.submitLabel || 'Submit'}
        </Button>
      )}
    </Box>
  );
};

ChatFormRenderer.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    submitLabel: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.array,
      default: PropTypes.any,
      required: PropTypes.bool,
      helperText: PropTypes.string,
      placeholder: PropTypes.string,
      validation: PropTypes.shape({
        pattern: PropTypes.string,
        message: PropTypes.string,
      }),
    })).isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatFormRenderer);
