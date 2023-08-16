/* eslint-disable  no-unused-vars */

import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import withStyles from '@mui/styles/withStyles';
// import * as _ from 'lodash';
import customTheme from '../../customTheme.json';
import {createArray} from '../../utils/utils';

const styles = {
  gradLegend: {
    zIndex: 1000,
    width: '220px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    position: 'absolute',
    top: '205px', // Position of the legend depending on the top of the parent block
    left: '-84px', // Position of the legend depending on the left of the parent block
    transform: 'rotate(-90deg)',
  },
  gradStep: {
    display: 'inline-block',
    height: '20px',
    float: 'left',
  },
  domainLabelCustom: {
    position: 'absolute',
    top: '28px', // Edit this to move the labels horizontally (+ right / - left)
    fontSize: ' 11px',
    transform: 'rotate(90deg)',
    marginLeft: '-30px', // Edit this to move the labels vertically (- down / + up)
    fontWeight: 'bold',
  },
  domainLabelStandard: {
    position: 'absolute',
    top: '28px', // Edit this to move the labels horizontally (+ right / - left)
    fontSize: ' 11px',
    transform: 'rotate(90deg)',
    marginLeft: '-8px', // Edit this to move the labels vertically (- down / + up)
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
  const {minValue, mapLegendMax, numberOfSteps, selectedMapTheme, legend, classes, id,
    primary} = props;

  // const mapLegendMax = maxValue; // useSelector((state) => state.filters.mapLegendMax);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);

  // Data-related variables
  // const step = (mapLegendMax - minValue) / numberOfSteps;

  const themeStr = _.find(customTheme, {color: selectedMapTheme} );

  // To get a continuous color scheme, remove the .classes()
  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme)
      .domain([minValue, mapLegendMax]).classes(numberOfSteps);

  const colors = scale.colors(10);

  let step = (mapLegendMax - minValue) / numberOfSteps;

  if (minValue < 0) {
    if (minValue * -1 > mapLegendMax) {
      step = minValue * -1 / ( numberOfSteps / 2);
    } else {
      step = mapLegendMax / ( numberOfSteps / 2);
    }
  }

  console.log('step:' + step);

  /**
   *
   * @return {*} custom legend
   */
  const customLegend = () => {
    return (
      <div className={classes.gradLegend} ref={legend} id={id}>
        <span style={{background: '#16af39', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          0
        </span>
        <span style={{background: '#f4ca18', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          5
        </span>
        <span style={{background: '#c81325', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          15
        </span>

        <span className={classes.domainLabelCustom} style={{left: 55, top: 55}} >
          &gt; 15 cases/1000
        </span>
      </div>
    );
  };

  /**
   *
   * @return {*} standard legend
   */
  const standardLegend = () => {
    return (<div className={classes.gradLegend} ref={legend} id={id}>
      {Array.from(scale.colors(numberOfSteps)).map((c) => {
        return <span key={c} style={{background: c, width: (100 / numberOfSteps) + '%'}}
          className={classes.gradStep}/>;
      })}

      {_.times(numberOfSteps+1, (num) => {
        return <span key={num} className={classes.domainLabelStandard}
          style={{left: (100 / numberOfSteps) * num + '%'}}>
          {(minValue + step * num).toFixed(0)}
        </span>;
      })}

    </div>);
  };

  /**
   *
   * @return {*} legend used for showing changes in cases
   */
  const diffLegend = () => {
    return (<div className={classes.gradLegend} ref={legend} id={id}>
      {Array.from(scale.colors(numberOfSteps)).map((c) => {
        return <span key={c} style={{background: c, width: (100 / numberOfSteps) + '%'}}
          className={classes.gradStep}/>;
      })}
      {
        createArray(-5, 5).map((num) => {
          return <span key={num+5} className={classes.domainLabelStandard}
            style={{left: (100 / numberOfSteps) * (num+5) + '%'}}>
            {(step * num).toFixed(0)}
          </span>;
        })
      }

    </div>);
  };

  // use difference map legend when diff map is 'on' and not primary map
  if (selectedDiffMap && !primary) {
    return diffLegend();
  }

  if (selectedLegend) {
    return standardLegend();
  } else {
    return customLegend();
  }
};

MapLegend.propTypes = {
  selectPlace: PropTypes.func.isRequired,
  minValue: PropTypes.number.isRequired,
  numberOfSteps: PropTypes.number.isRequired,
  selectedMapTheme: PropTypes.string.isRequired,
  selectedLegend: PropTypes.bool,
  legend: PropTypes.object,
  classes: PropTypes.object,
  id: PropTypes.string,
  primary: PropTypes.primary,
};

export default withStyles(styles)(MapLegend);
