/* eslint-disable  no-unused-vars */
import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import withStyles from '@mui/styles/withStyles';
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
  blueLegend: {
    zIndex: 1000,
    width: '220px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    position: 'absolute',
    top: '375px', // Position of the legend depending on the top of the parent block
    left: '-84px', // Position of the legend depending on the left of the parent block
    transform: 'rotate(-90deg)',
  },
  gradStep: {
    display: 'inline-block',
    height: '20px',
    float: 'left',
    borderTop: '1px solid grey',
    borderLeft: '1px solid grey',
    borderBottom: '1px solid grey',
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
    top: '22px', // Edit this to move the labels horizontally (+ right / - left)
    fontSize: ' 11px',
    transform: 'rotate(90deg)',
    marginLeft: '-2px', // Edit this to move the labels vertically (- down / + up)
    fontWeight: 'bold',
    width: 5,
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
    selectedLayer, primary} = props;

  // const mapLegendMax = maxValue; // useSelector((state) => state.filters.mapLegendMax);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);
  // const selectedLayer = useSelector((state) => state.filters.selectedLayer);

  // Data-related variables
  const themeStr = _.find(customTheme, {color: selectedMapTheme} );

  // To get a continuous color scheme, remove the .classes()
  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme)
      .domain([minValue, mapLegendMax]).classes(numberOfSteps);

  // To get a continuous color scheme, remove the .classes()
  const blues = chroma.scale('Blues').domain([0, 1]).classes(5);

  let step = (mapLegendMax - minValue) / numberOfSteps;

  if (minValue < 0) {
    if (minValue * -1 > mapLegendMax) {
      step = minValue * -1 / ( numberOfSteps / 2);
    } else {
      step = mapLegendMax / ( numberOfSteps / 2);
    }
  }

  const unitLabel = (label) => {
    return (
      <div className={classes.domainLabelCustom}
        style={{
          width: 0, top: 33, left: -33, backgroundColor: 'darkgrey',
          color: 'white', width: 85, textAlign: 'center',
        }}>
        {label}
      </div>);
  };


  /**
   *
   * @return {*} custom legend
   */
  const customLegend = () => {
    return (
      <div className={classes.gradLegend} ref={legend} id={id}>
        {/* unit  */}
        {unitLabel('cases / 1000')}
        <span style={{background: '#1d9660', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          0
        </span>
        <span style={{background: '#1bd357', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          5
        </span>
        <span style={{background: '#9efe66', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          50
        </span>
        <span style={{background: '#fdff01', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          100
        </span>
        <span style={{background: '#fca725', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          250
        </span>
        <span style={{background: '#fb0000', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          450
        </span>
        <span style={{background: '#850428', width: 20}}
          className={classes.gradStep} />
        <span className={classes.domainLabelCustom} style={{width: 20}}>
          650
        </span>

        <span className={classes.domainLabelCustom} style={{left: 158, top: 32}}>
          &gt; 650
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
      {unitLabel('cases / 1000')}
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
   * @param {string} layer
   * @return {*} standard legend
   */
  const healthClinicLegend = (layer) => {
    const numberOfSteps = 5;
    if (!layer) {
      return <></>;
    }
    return (<div className={classes.blueLegend} ref={legend} id={id}>
      {unitLabel('f.polygenomic')}
      {Array.from(blues.colors(5)).map((c) => {
        return <span key={c} style={{background: c, width: 10 + '%'}}
          className={classes.gradStep}/>;
      })}

      {_.times(numberOfSteps+1, (num) => {
        return <span key={num} className={classes.domainLabelStandard}
          style={{left: 10 * num + '%'}}>
          {(0 + num*20/100).toFixed(1)}
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
      {unitLabel('cases / 1000')}
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
    return <>
      {diffLegend()}
      {healthClinicLegend(selectedLayer)}
    </>;
  }

  if (selectedLegend) {
    return <>
      {standardLegend()}
      {healthClinicLegend(selectedLayer)}
    </>;
  } else {
    return <>
      {customLegend()}
      {healthClinicLegend(selectedLayer)}
    </>;
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
  selectedLayer: PropTypes.string,
  mapLegendMax: PropTypes.number,
};

export default withStyles(styles)(MapLegend);
