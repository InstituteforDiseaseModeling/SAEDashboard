
/* eslint-disable  no-unused-vars */
import React from 'react';
import customTheme from '../../customTheme.json';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import withStyles from '@mui/styles/withStyles';
import {IndicatorConfig} from '../constTs.tsx';
import * as translations from '../../data/translation/index.js';
import {CoVariatesCategoryLookup} from '../../const.js';
import {injectIntl} from 'react-intl';

const styles = {
  gradLegend: {
    zIndex: 1000,
    width: '70px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    position: 'absolute',
    top: '210px', // Position of the legend depending on the top of the parent block
    left: '-14px', // Position of the legend depending on the left of the parent block
    transform: 'rotate(-90deg)',
  },
  gradStep: {
    display: 'inline-block',
    height: '15px',
    float: 'left',
    borderTop: '1px solid grey',
    // borderLeft: '1px solid grey',
    borderRight: '1px solid grey',
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
    marginLeft: '4px', // Edit this to move the labels vertically (- down / + up)
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
const CoVarsLegend = (props) => {
  const {selectedMapTheme, legend, classes, id, selectedIndicator} = props;
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);


  const themeStr = _.find(customTheme, {color: selectedMapTheme} );
  const minValue = 1;
  const mapLegendMax = 5;
  const numberOfSteps = 5;

  const step = 1;

  // To get a continuous color scheme, remove the .classes()
  const scale = chroma.scale(themeStr ? themeStr.values : selectedMapTheme)
      .domain([0, mapLegendMax-minValue + 1]).classes(numberOfSteps);

  const unitLabel = (label) => {
    return (
      <div className={classes.domainLabelCustom}
        style={{
          width: 0, top: 50, left: -55, backgroundColor: 'darkgrey',
          color: 'white', width: 120, textAlign: 'center',
        }}>
        {label}
      </div>);
  };

  const indicatorUnitlabel = _.get(IndicatorConfig[selectedIndicator], 'mapLabel');

  const yLabel = _.get(translations[selectedLocale], indicatorUnitlabel);

  const standardLegend = (selectedIndicator) => {
    const multiper = selectedIndicator && IndicatorConfig[selectedIndicator] ?
      IndicatorConfig[selectedIndicator].multiper : 1;
    const unit = selectedIndicator && IndicatorConfig[selectedIndicator] ?
      IndicatorConfig[selectedIndicator].unit.replace('\'', '') : '';
    return (<div className={classes.gradLegend} ref={legend} id={id}>
      {unitLabel(yLabel)}
      {Array.from(scale.colors(numberOfSteps)).map((c) => {
        return <span key={c} style={{background: c, width: (100 / numberOfSteps) + '%'}}
          className={classes.gradStep}/>;
      })}
      {_.times(numberOfSteps, (num) => {
        const coVariateName = 'coVar_' +
          _.get(_.find(CoVariatesCategoryLookup, {'category': num+1}), 'coVariate') +
          '_short';
        const shortName = props.intl.formatMessage({id: coVariateName});

        return <span key={num} className={classes.domainLabelStandard}
          style={{left: (100 / numberOfSteps) * num + '%'}}>
          {shortName}
        </span>;
      })}
    </div>);
  };

  return (
    <>
      {standardLegend(selectedIndicator)}
    </>
  );
};

CoVarsLegend.propTypes = {
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
  unselectedLayer: PropTypes.string,
  mapLegendMax: PropTypes.number,
  selectedIndicator: PropTypes.string,
  intl: PropTypes.func,
};

export default withStyles(styles)(injectIntl(CoVarsLegend));
