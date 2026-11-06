/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-invalid-this */
/* eslint-disable comma-dangle */

import React from 'react';
import {FormattedMessage} from 'react-intl';

/**
 *
 * @returns covariates extra info
 */
export function extraInfo(indicator) {
  const lineStyle = {padding: '10px 20px', width: '100%', fontSize: '0.9rem'};

  switch (indicator) {
    default:
      return (
        <div style={lineStyle}><FormattedMessage id={indicator+'_extra_info'}/></div>
      );
  }
}
