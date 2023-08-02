import React from 'react';
import LineChart from './LineChart';
import PropTypes from 'prop-types';

/**
 * EventLineChart component
 * @param {*} props
 * @return {React.ReactElement}
 */
const EventLineChart = (props) => {
  const {chartData, title, channel, selectedState} = props;

  return (
    <LineChart chartData={chartData} title={title} channel={channel}
      selectedState={selectedState} />
  );
};

EventLineChart.propTypes = {
  channel: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  title: PropTypes.string,
  selectedState: PropTypes.string,
};

export default EventLineChart;
