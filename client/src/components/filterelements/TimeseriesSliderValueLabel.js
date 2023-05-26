// ==============================================================================
// TimeseriesSliderValueLabel
//
// (c) 2020 Institute for Disease Modeling. Written by Bryan K. Ressler.
// This component adapted from React's PrivateValueLabel component.
// ==============================================================================

// ==============================================================================
// Imports
// ==============================================================================
import _extends from '@babel/runtime/helpers/esm/extends';
import * as React from 'react';
import clsx from 'clsx';
import withStyles from '@mui/styles/withStyles';

// ==============================================================================
// Styles
// ==============================================================================
const styles = (theme) => {
  return {
    thumb: {
      'textAlign': 'center !important',
      '&$open': {
        '& $offset': {
          transform: 'scale(1) translateY(-10px)',
        },
      },
    },
    open: {},
    offset: _extends(
        {zIndex: 1},
        theme.typography.body2,
        {
          top: 11,
          left: 12,
          transformOrigin: 'bottom center',
          transform: 'scale(0)',
          position: 'absolute',
          fontSize: theme.typography.pxToRem(12),
          transition: theme.transitions.create(['transform'],
              {duration: theme.transitions.duration.shortest}),
        }),
    label: {
      display: 'inline-block',
      marginTop: 7,
      color: 'white',
      fontSize: '1em',
      fontFamily: '\'Roboto Condensed\', Roboto, \'Helvetica Neue\', sans-serif',
    },
  };
};


/**
 * TimeseriesSliderValueLabel
 * @param {*} props
 * @return {React.ReactElement}
 */
function TimeseriesSliderValueLabel(props) {
  const children = props.children;
  const classes = props.classes;
  const className = props.className;
  const open = props.open;
  const value = props.value;
  const valueLabelDisplay = props.valueLabelDisplay;

  if (valueLabelDisplay === 'off') {
    return children;
  }

  return React.cloneElement(children, {
    className: clsx(children.props.className,
        (open || valueLabelDisplay === 'on') && classes.open, classes.thumb),
  }, React.createElement('span', {
    className: clsx(classes.offset, className),
  }, React.createElement('span', {
    className: classes.circle,
  }, React.createElement('span', {
    className: classes.label,
  }, value))));
}

export default withStyles(styles, {
  name: 'TimeseriesSliderValueLabel',
})(TimeseriesSliderValueLabel);
