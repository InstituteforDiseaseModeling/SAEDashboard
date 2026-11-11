import React from 'react';
import PropTypes from 'prop-types';

const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<]+)/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)\]'"]+$/;

const LinkifiedText = ({text, linkText}) => {
  if (!text) {
    return null;
  }
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const url = match[0].replace(TRAILING_PUNCTUATION, '');
    parts.push(text.slice(last, match.index));
    parts.push(
        <a key={match.index} href={url.startsWith('www.') ? 'https://' + url : url}
          target="_blank" rel="noopener noreferrer" title={linkText ? url : undefined}
          onClick={(e) => e.stopPropagation()}>
          {linkText || url}
        </a>,
    );
    last = match.index + url.length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
};

LinkifiedText.propTypes = {
  text: PropTypes.string,
  linkText: PropTypes.string,
};

export default LinkifiedText;
