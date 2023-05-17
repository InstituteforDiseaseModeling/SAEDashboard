
import React from 'react';

export const ChartContext = React.createContext({
  maxYAxisVal: 0,
  setMaxYAxisVal: null,
  minYAxisVal: 1000,
  setMinYAxisVal: null,
});
