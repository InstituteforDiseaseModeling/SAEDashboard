/* eslint-disable  no-unused-vars */
import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import withStyles from '@mui/styles/withStyles';
import customTheme from '../../customTheme.json';
import {createArray} from '../../utils/utils';
import * as translations from '../../data/translation';
import {IndicatorConfig} from '../constTs.tsx';
import {isIncidenceMap} from './Map2.tsx';

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
    selectedLayer, primary, selectedIndicator} = props;

  // const mapLegendMax = maxValue; // useSelector((state) => state.filters.mapLegendMax);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);

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
          width: 0, top: 85, left: -85, backgroundColor: 'darkgrey',
          color: 'white', width: 190, textAlign: 'center',
        }}>
        {label}
      </div>);
  };

  console.log(IndicatorConfig);

  console.log(IndicatorConfig[selectedIndicator]);

  const yLabel = _.get(translations[selectedLocale], IndicatorConfig[selectedIndicator].unitLabel);
  const legendTitle = _.get(translations[selectedLocale], 'fraction_polygenomic');

  /**
   *
   * @return {*} custom legend
   */
  const customLegend = () => {
    return (
      <div className={classes.gradLegend} ref={legend} id={id}>
        {/* unit  */}
        {unitLabel(yLabel)}
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
   * @param {*} selectedIndicator - maximum legend value
   * @return {*} standard legend
   */
  const standardLegend = (selectedIndicator) => {
    const multiper = selectedIndicator && IndicatorConfig[selectedIndicator] ?
      IndicatorConfig[selectedIndicator].multiper : 1;
    const unit = selectedIndicator && IndicatorConfig[selectedIndicator] ?
      IndicatorConfig[selectedIndicator].unit : '';
    return (<div className={classes.gradLegend} ref={legend} id={id}>
      {unitLabel(yLabel)}
      {Array.from(scale.colors(numberOfSteps)).map((c) => {
        return <span key={c} style={{background: c, width: (100 / numberOfSteps) + '%'}}
          className={classes.gradStep}/>;
      })}
      {_.times(numberOfSteps+1, (num) => {
        return <span key={num} className={classes.domainLabelStandard}
          style={{left: (100 / numberOfSteps) * num + '%'}}>
          {Math.round(((minValue + step * num) * multiper)).toLocaleString() + unit }
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

    if (layer) {
      return (<div className={classes.blueLegend} ref={legend} id={id}>
        {unitLabel(legendTitle)}
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
    } else {
      return <></>;
    }
  };


  /**
   *
   * @return {*} legend used for showing changes in cases
   */
  const diffLegend = () => {
    return (<div className={classes.gradLegend} ref={legend} id={id}>
      {unitLabel(yLabel)}
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
      {standardLegend(selectedIndicator)}
      {healthClinicLegend(selectedLayer)}
    </>;
  } else {
    if (isIncidenceMap(selectedIndicator)) {
      return <>
        {customLegend()}
        {healthClinicLegend(selectedLayer)}
      </>;
    } else {
      return <>
        {standardLegend(selectedIndicator)}
        {healthClinicLegend(selectedLayer)}
      </>;
    }
  };
};

MapLegend.propTypes = {
  selectPlace: PropTypes.func,
  minValue: PropTypes.number.isRequired,
  numberOfSteps: PropTypes.number.isRequired,
  selectedMapTheme: PropTypes.string.isRequired,
  selectedLegend: PropTypes.bool,
  legend: PropTypes.object,
  classes: PropTypes.object,
  id: PropTypes.string,
  primary: PropTypes.bool,
  selectedLayer: PropTypes.string,
  mapLegendMax: PropTypes.number,
  selectedIndicator: PropTypes.string,
};

export default withStyles(styles)(MapLegend);
