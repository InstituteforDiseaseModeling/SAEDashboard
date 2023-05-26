import React, {useEffect, useState} from 'react';
import {Typography} from '@mui/material';
import LineChart from './uielements/LineChart';
import axios from 'axios';
import withStyles from '@mui/styles/withStyles';
import loader from '../image/loader.gif';
import {showError} from '../redux/actions/messaging';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

const styles = {
  title: {
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
};

const StateDataChart = (props) => {
  const {classes, group, groupName, selectedState, channel} = props;
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      axios.defaults.baseURL = process.env.API_BASE_URL || '/api';
      try {
        const result = await axios(
            '/timeseries?dot_name=' + selectedState + '&channel=' + channel + '&subgroup=' + group,
        );
        setData(result.data);
      } catch (error) {
        let errMsg = 'Error occurred.';
        if (data && data.response && data.response.data) {
          errMsg = data.response.data;
        }
        dispatch(showError(errMsg));
        setIsError(true);
      }
    };

    // Only fetch if a state and group are selected!
    if (selectedState && group && channel) {
      fetchData();
    }
  }, [selectedState, channel, group]);

  if (!data && !isError) {
    return (
      <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
        <img src={loader} alt={'Loading...'}/>
      </div>);
  }

  return (
    <>
      <Typography variant="subtitle2" className={classes.title}>{groupName}</Typography>
      {isError ?
        <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
          Error loading chart data...</div> :
        <LineChart chartData={data} title={group} channel={channel} />}
    </>
  );
};

StateDataChart.propTypes = {
  classes: PropTypes.object,
  group: PropTypes.string,
  groupName: PropTypes.string,
  selectedState: PropTypes.string,
  channel: PropTypes.string,
};

export default withStyles(styles)(StateDataChart);

