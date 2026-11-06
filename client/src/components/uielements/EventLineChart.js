import React from 'react';
import {useSelector} from 'react-redux';
import LineChart from './LineChart';
import PropTypes from 'prop-types';

/**
 * EventLineChart component
 * @param {*} props
 * @return {React.ReactElement}
 */
const EventLineChart = (props) => {
  const {chartData, title, channel, selectedState, combined} = props;

  const eventData = useSelector((state) => state.dashboard.eventData);

  return (
    <LineChart chartData={chartData} title={title} channel={channel}
      selectedState={selectedState} eventData={eventData} combined={combined}/>
  );
};

EventLineChart.propTypes = {
  channel: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  title: PropTypes.string,
  selectedState: PropTypes.string,
  eventData: PropTypes.array,
  combined: PropTypes.bool,
};

export default EventLineChart;
