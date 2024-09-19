import React, {useEffect} from 'react';
import {Typography} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper';
import {useSelector} from 'react-redux';
import {Toolbar, AppBar} from '@mui/material';
import PropTypes from 'prop-types';
import RainfallDataChart from './RainfallDataChart';
import RainfallZoneDataChart from './RainfallZoneDataChart';
import {FormattedMessage} from 'react-intl';

const styles = {
  title: {
    textAlign: 'center',
    width: '100%',
    marginTop: 5,
    marginLeft: 25,
    fontSize: 15,
  },
  chartArea: {
    padding: 5,
    margin: '-10px 5px 0px 5px',
    minHeight: 478,
  },
  toggles: {
    textAlign: 'center',
    width: '1000px',
    margin: '0 auto',
    marginBottom: 10,
  },
  grow: {
    flexGrow: 1,
  },
  chartBar: {
    marginBottom: 5,
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 5,
    marginRight: -15,
    width: 80,
  },
  link: {
    color: 'white',
    textAlign: 'right',
    cursor: 'pointer',
  },
};

const StateData = (props) => {
  const {classes} = props;
  const selectedRainfallStation = useSelector((state) => state.filters.selectedRainfallStation);
  const selectedRainfallZone = useSelector((state) => state.filters.selectedRainfallZone);

  useEffect(() => {
  }, [selectedRainfallStation, selectedRainfallZone]);

  return (
    <Paper className={classes.chartArea}>
      {/* app bar charts */}
      <AppBar position="static" >
        <Toolbar variant="dense" className={classes.chartBar}>
          <Typography variant="h6" className={classes.title}>
            <FormattedMessage id='rainfall_measured_at'/>
            {selectedRainfallStation &&
              <>
                <FormattedMessage id='station'/> -&nbsp;
                {selectedRainfallStation}
              </>}
            {selectedRainfallZone &&
              <>
                <FormattedMessage id='zone'/> -&nbsp;
                {selectedRainfallZone}
              </>
            }
          </Typography>
          <div className={classes.grow} key={1}/>
        </Toolbar>
      </AppBar>
      { selectedRainfallStation && <RainfallDataChart /> }
      { selectedRainfallZone && <RainfallZoneDataChart /> }
    </Paper>
  );
};

StateData.propTypes = {
  classes: PropTypes.object,
  selectedState: PropTypes.string,
  indicators: PropTypes.array,
};

export default withStyles(styles)(StateData);

