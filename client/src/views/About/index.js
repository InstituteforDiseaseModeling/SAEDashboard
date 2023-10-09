import React from 'react';
import {default as En} from './About_en.js';
import {default as Fr} from './About_fr.js';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';

const About = (props) => {
  const {intl} = props;
  
  if (intl.locale === 'en') {
    return (<En/>);
  } else if (intl.locale === 'fr') {
    return (<Fr/>);
  }
};

About.propTypes = {
  intl: PropTypes.func,
};

export default injectIntl(About);
