/* eslint-disable  no-unused-vars */
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';
import _ from 'lodash';
import withStyles from '@mui/styles/withStyles';
import customTheme from '../../../customTheme.json';
import {createArray} from '../../../utils/utils.js';
import * as translations from '../../../data/translation/index.js';
import {useIndicatorConfig} from '../../../hooks/useAppConfig.ts';
import {isIncidenceMap} from '../Map2.tsx';

const styles = {
  gradLegend: {
    zIndex: 1000,
    width: '220px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    position: 'absolute',
    top: '182px', // Position of the legend depending on the top of the parent block
    left: '-84px', // Position of the legend depending on the left of the parent block
    transform: 'rotate(-90deg)',
  },
  blueLegend: {
    zIndex: 1000,
    width: '220px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    position: 'absolute',
    top: '355px', // Position of the legend depending on the top of the parent block
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
    selectedLayer, primary, selectedIndicator, unselectedLayer} = props;

  // const mapLegendMax = maxValue; // useSelector((state) => state.filters.mapLegendMax);
  const indicatorConfig = useIndicatorConfig(selectedIndicator);
  const selectedLegend = useSelector((state) => state.filters.selectedLegend);
  const selectedDiffMap = useSelector((state) => state.filters.selectedDiffMap);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  let [showClinic, setShowClinic] = React.useState(false);

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
    const longLabel = (label && label.length) > 40;
    return (
      <div className={classes.domainLabelCustom}
        style={{
          top: longLabel ? 45 : 52, left: longLabel ? -65 : -55, backgroundColor: 'darkgrey',
          color: 'white', width: 120, textAlign: 'center',
          maxHeight: 50, overflowWrap: 'anywhere',
          whiteSpace: 'initial',
        }}>
        {label}
      </div>);
  };

  const indicatorUnitlabel = indicatorConfig?.legendLabel;

  const yLabel = _.get(translations[selectedLocale], indicatorUnitlabel, indicatorUnitlabel);
  const legendTitle = _.get(translations[selectedLocale], 'fraction_polygenomic');

  /**
   * @param {*} selectedIndicator - maximum legend value
   * @return {*} standard legend
   */
  const standardLegend = (selectedIndicator) => {
    const multiper = indicatorConfig?.multiper ?? 1;
    const unit = (indicatorConfig?.unit || '').replace('\'', '');
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

  useEffect(() => {
    const sentinelFacilitylayer = _.get(translations[selectedLocale], 'sentinel_facilities');

    if (selectedLayer && selectedLayer.indexOf('barcode_data') > -1) {
      setShowClinic(true);
      showClinic = true;
    }

    if (unselectedLayer && unselectedLayer.indexOf('barcode_data') > -1) {
      setShowClinic(false);
      showClinic = false;
    };
  }, [selectedLayer, unselectedLayer]);

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
    </>;
  } else {
    return <>
      {standardLegend(selectedIndicator)}
    </>;
  }
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
  unselectedLayer: PropTypes.string,
  mapLegendMax: PropTypes.number,
  selectedIndicator: PropTypes.string,
};

export default withStyles(styles)(MapLegend);
