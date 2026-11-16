import withStyles from '@mui/styles/withStyles';
import {Slider} from '@mui/material';

/**
 * Refined pill-thumb slider used for year / month selection.
 *
 * The thumb itself shows the value (no floating label below), so the control
 * reads as a single tactile pill that slides along a thin rail.
 */
export const TimeseriesSlider = withStyles({
  root: {
    'color': '#313A44',
    'width': 'calc(100% - 70px)',
    'marginRight': 36,
    'marginLeft': 8,
    'marginTop': 18,
    'padding': '10px 0',
    '& .MuiSlider-mark': {
      backgroundColor: 'rgba(49, 58, 68, 0.28)',
      width: 2,
      height: 8,
      borderRadius: 1,
    },
    '& .MuiSlider-markActive': {
      backgroundColor: 'rgba(49, 58, 68, 0.7)',
      opacity: 1,
    },
    '& .MuiSlider-markLabel': {
      fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: 'rgba(49, 58, 68, 0.7)',
      marginTop: 2,
    },
    '& .MuiSlider-markLabelActive': {
      color: '#313A44',
      fontWeight: 600,
    },
  },
  thumb: {
    'width': 46,
    'height': 24,
    'marginTop': 0,
    'borderRadius': 12,
    'backgroundColor': '#313A44',
    'boxShadow': '0 1px 3px rgba(49, 58, 68, 0.25), 0 0 0 1px rgba(255,255,255,0.06) inset',
    'transition': 'box-shadow 140ms ease, transform 140ms ease, background-color 140ms ease',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 2px 8px rgba(49, 58, 68, 0.35), 0 0 0 1px rgba(255,255,255,0.08) inset',
      backgroundColor: '#313A44',
    },
    '&.Mui-active': {
      boxShadow: '0 3px 10px rgba(49, 58, 68, 0.45)',
      transform: 'translate(-50%, -50%) scale(1.04)',
    },
  },
  track: {
    height: 3,
    border: 'none',
    backgroundColor: '#313A44',
    opacity: 0.85,
  },
  rail: {
    height: 3,
    marginLeft: 0,
    backgroundColor: 'rgba(49, 58, 68, 0.18)',
    opacity: 1,
    borderRadius: 2,
  },
  valueLabel: {
    'backgroundColor': 'transparent',
    'color': '#F5F3ED',
    'fontFamily': '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    'fontSize': 12,
    'fontWeight': 600,
    'letterSpacing': '0.06em',
    'padding': 0,
    'top': '50%',
    'left': '50%',
    'transform': 'translate(-50%, -50%) !important',
    'pointerEvents': 'none',
    '&:before': {
      display: 'none',
    },
    '& > *': {
      transform: 'none',
    },
  },
})(Slider);
