import React, {useEffect, useState} from 'react';
import {Grid, Typography} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import StateDataChart from './StateDataChart';
import ChartSubgroupsFilter from './filterelements/ChartSubgroupsFilter';
import axios from 'axios';
import * as _ from 'lodash';
import Paper from '@mui/material/Paper';
import {useSelector} from 'react-redux';
import {Toolbar, AppBar, Link} from '@mui/material';
import {ChartContext} from '../components/context/chartContext';
import PropTypes from 'prop-types';
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
  const {classes, selectedState, indicators} = props;

  const [subgroups, setSubgroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const channel = useSelector((state) => state.filters.selectedIndicator);

  const [maxYAxisVal, setMaxYAxisVal] = useState(0);
  const [minYAxisVal, setMinYAxisVal] = useState(1000);

  const contextValue = {maxYAxisVal, setMaxYAxisVal, minYAxisVal, setMinYAxisVal};

  /** show all groups */
  const showAll = () => {
    setSelectedGroups(subgroups.map((i)=>i.id));
  };

  /** hide all groups */
  const hideAll = () => {
    setSelectedGroups([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.baseURL = process.env.API_BASE_URL || '/api';

      const result = await axios(
          '/subgroups?dot_name=' + selectedState,
      );
      // By default, select all groups
      setSubgroups(result.data['subgroups']);
      setSelectedGroups(_.map(result.data['subgroups'], (e) => e.id));
    };

    // Only fetch if a state is selected!
    if (selectedState) {
      fetchData();
      setMaxYAxisVal(0);
      setMinYAxisVal(1000);
    }
  }, [selectedState]);

  useEffect(()=> {
    setMaxYAxisVal(0);
    setMinYAxisVal(1000);
  }, [selectedGroups.length, channel]);

  const toggleGroup = (toggleGroup) => {
    const index = _.indexOf(selectedGroups, toggleGroup);

    // If we have the index present -> remove it
    if (index !== -1) {
      setSelectedGroups([...selectedGroups.filter((group) => group !== toggleGroup)]);
    } else {
      // Was not present -> add it back using order from subgroups
      const newGroups = [...selectedGroups, toggleGroup];
      const newSelectedGroups = subgroups.filter((group) => {
        if (newGroups.indexOf(group.id) > -1) {
          return group.id;
        }
      });
      setSelectedGroups(newSelectedGroups.map( (group)=>group.id));
    }
  };

  // Dont display anything if we do not have the subgroups yet
  if (subgroups.length === 0) {
    return null;
  }
  const indObj = _.find(indicators, ['id', channel]);


  return (
    <Paper className={classes.chartArea}>
      {/* app bar charts */}
      <AppBar position="static" >
        <Toolbar variant="dense" className={classes.chartBar}>
          <Typography variant="h6" className={classes.title}>
            {selectedState} ({indObj ? indObj['text'] : '' })
          </Typography>
          <div className={classes.grow} key={1}/>
          <div className={classes.linkContainer} key={2}>
            <Link className={classes.link} onClick={showAll}>
              <Typography variant="subtitle2">
                <FormattedMessage id="show_all"/>
              </Typography>
            </Link>
            <Link className={classes.link} onClick={hideAll}>
              <Typography variant="subtitle2">
                <FormattedMessage id="hide_all"/>
              </Typography>
            </Link>
          </div>
        </Toolbar>
      </AppBar>

      <ChartContext.Provider value={contextValue}>
        <div className={classes.toggles}>
          <ChartSubgroupsFilter groups={subgroups}
            selectedGroups={selectedGroups}
            toggleGroup={toggleGroup}/>
        </div>
        <Grid container spacing={1} >
          {selectedGroups.map((group) => {
            const g = _.find(subgroups, ['id', group]);
            const groupName = g ? g.text: '';

            return (
              <Grid item xs={12} md={6} xl={4} key={groupName} >
                <StateDataChart
                  group={group}
                  groupName={groupName}
                  selectedState={selectedState}
                  channel={channel}
                  key={channel+selectedState}
                />
              </Grid>
            );
          })}
        </Grid>
      </ChartContext.Provider>
    </Paper>
  );
};

StateData.propTypes = {
  classes: PropTypes.object,
  selectedState: PropTypes.string,
  indicators: PropTypes.array,
};

export default withStyles(styles)(StateData);

