import React from 'react';

export const ChartContext = React.createContext({
  yAxisRange: null,
  reportYRange: () => {},
});

export const yRangeKey = (channel, selectedState, group) =>
  [channel, selectedState, group].join('|');
