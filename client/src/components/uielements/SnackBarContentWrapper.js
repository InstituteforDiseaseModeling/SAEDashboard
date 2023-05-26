
import React from 'react';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import {amber, green} from '@mui/material/colors';
import withStyles from '@mui/styles/withStyles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = (theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: 5,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },

});

/**
 *
 * @param {*} props
 * @return {*} SnackbarContentWrapper
 */
function SnackbarContentWrapper(props) {
  const {classes, className, message, onClose, variant, ...other} = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className, classes.root)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
          size="large">
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

SnackbarContentWrapper.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  variant: PropTypes.string,
  other: PropTypes.object,
};

export default withStyles(styles, {withTheme: true})(SnackbarContentWrapper);
