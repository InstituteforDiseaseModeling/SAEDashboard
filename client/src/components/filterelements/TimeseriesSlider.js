import withStyles from '@mui/styles/withStyles';
import {Slider} from '@mui/material';

/**
 * custom slider
 */
export const TimeseriesSlider = withStyles({
  root: {
    color: '#007db5',
    width: 'calc(100% - 85px)',
    marginRight: 50,
    marginLeft: 0,
    marginTop: 15,
  },
  thumb: {
    width: 50,
    height: 30,
    marginTop: 0,
    borderRadius: 4,
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    color: '#24323c',
  },
  track: {
    height: 5,
    // marginTop: 15,
  },
  rail: {
    height: 5,
    // marginTop: 15,
    marginLeft: 0,
  },
  valueLabel: {
    top: 30,
    backgroundColor: 'transparent',
    left: 0,
    color: 'white',
  },
})(Slider);
