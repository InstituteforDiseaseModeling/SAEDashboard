import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import withStyles from '@mui/styles/withStyles';
import * as _ from 'lodash';
import customTheme from '../../customTheme.json';

const styles = {
  gradLegend: {
    zIndex: 1000,
    width: '220px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    position: 'absolute',
    top: '185px', // Position of the legend depending on the top of the parent block
    left: '-84px', // Position of the legend depending on the left of the parent block
    transform: 'rotate(-90deg)',
  },
  gradStep: {
    display: 'inline-block',
    height: '20px',
    float: 'left',
  },
  domainLabel: {
    position: 'absolute',
    top: '28px', // Edit this to move the labels horizontally (+ right / - left)
    fontSize: ' 11px',
    transform: 'rotate(90deg)',
    marginLeft: '-11px', // Edit this to move the labels vertically (- down / + up)
    fontWeight: 'bold',
  },
};

/**
 * component for the map legend. It is not being used as the problem is that this
 * legend cannot be exported as part of the amchart chart image.
 * @param {*} props
 * @return {*} map legend component
 */
const MapLegend = (props) => {
  const {minValue, numberOfSteps, selectedMapTheme, legend, classes, id} = props;

  const mapLegendMax = useSelector((state) => state.filters.mapLegendMax);

  // Data-related variables
  const step = (mapLegendMax - minValue) / numberOfSteps;

  const themeStr = _.find(customTheme, {color: selectedMapTheme} );

  // To get a continuous color scheme, remove the .classes()
  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme)
      .domain([minValue, mapLegendMax]).classes(numberOfSteps);

  return (
    <div className={classes.gradLegend} ref={legend} id={id}>
      {Array.from(scale.colors(numberOfSteps)).map((c) => {
        return <span key={c} style={{background: c, width: (100 / numberOfSteps) + '%'}}
          className={classes.gradStep}/>;
      })}

      {_.times(numberOfSteps + 1, (num) => {
        return <span key={num} className={classes.domainLabel}
          style={{left: (100 / numberOfSteps) * num + '%'}}>
          {(minValue + step * num * 100).toFixed(0)}%
        </span>;
      })}

    </div>
  );
};

MapLegend.propTypes = {
  selectPlace: PropTypes.func.isRequired,
  minValue: PropTypes.number.isRequired,
  numberOfSteps: PropTypes.number.isRequired,
  selectedMapTheme: PropTypes.string.isRequired,
  legend: PropTypes.object,
  classes: PropTypes.object,
  id: PropTypes.string,
};

export default withStyles(styles)(MapLegend);
