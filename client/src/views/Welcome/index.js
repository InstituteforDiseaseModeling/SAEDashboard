import React from 'react';
import {default as En} from './Welcome_en.js';
import {default as Fr} from './Welcome_fr.js';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';

const Welcome = (props) => {
  const {intl} = props;
  if (intl.locale === 'en') {
    return (<En/>);
  } else if (intl.locale === 'fr') {
    return (<Fr/>);
  }
};

Welcome.propTypes = {
  intl: PropTypes.func,
};

export default injectIntl(Welcome);
