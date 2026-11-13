/* eslint-disable max-len */
import React from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import {Typography, Button, Box} from '@mui/material';

const styles = ({
  content: {
    maxWidth: '900px',
    width: '70%',
    margin: '5rem auto',
  },
  contentText: {
    fontFamily: '"Roboto condensed","Roboto", "Times", "Helvetica", "Arial", "sans-serif"',
    fontSize: 16,
    textAlign: 'justify',
    textJustify: 'inter-word',
    marginBottom: '1rem',
  },
  titleText: {
    fontFamily: '"Roboto Condensed","Roboto", "Helvetica", "Arial", "sans-serif"',
    margin: '20px 20px 10px 0px',
    fontSize: '1.25rem',
    // color: '#F1815E',
  },
  link: {
    fontFamily: '"Saira Condensed"',
  },
  buttonContainer: {
    marginTop: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
    border: '1px solid #ddd',
  },
  customTextStyleOne: {
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontFamily: '"Roboto Condensed","Roboto", "Helvetica", "Arial", "sans-serif"',
    margin: '2rem 0 0.5rem',
    fontSize: '1.1rem',
  },
  list: {
    marginTop: 0,
    paddingLeft: '1.5rem',
  },
  listText: {
    fontFamily: '"Roboto condensed","Roboto", "Times", "Helvetica", "Arial", "sans-serif"',
    fontSize: 16,
    marginBottom: '0.5rem',
  },
});

const Welcome = ({classes}) => {
  const handleClick = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className={classes.content}>
      <Typography variant="h6" className={classes.titleText}>
        Welcome to the Subnational Family Planning Estimation Tool
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        This repository contains a map-based dashboard that displays subnational data: model results, surveillance data, and other geospatial and temporal data. Users can configure it to show different kinds of data on maps and over time. The sample data provided shows family planning model output in Senegal.
      </Typography>

      <Typography variant="h6" className={classes.sectionTitle}>
        AI assistant
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        The dashboard includes an AI assistant that helps you bring in your own data and explore it in plain language. Open it with the AI button (the speech bubble with a sparkle) in the top right corner of the dashboard page. It opens as a panel next to the maps, so you can keep using the dashboard while you work with it. The panel has three tabs:
      </Typography>
      <ul className={classes.list}>
        <li>
          <Typography className={classes.listText}>
            <b>List</b> – see the indicators managed by the assistant, with their details. You can show or hide your own indicators on the dashboard, download them, or delete them.
          </Typography>
        </li>
        <li>
          <Typography className={classes.listText}>
            <b>Add</b> – turn a CSV or Excel file into a new dashboard indicator. Upload the file, and the assistant checks it and guides you through the indicator&apos;s settings, such as its name, subgroups and color theme, before adding it to the map.
          </Typography>
        </li>
        <li>
          <Typography className={classes.listText}>
            <b>Analyze</b> – ask questions about the indicators, for example which districts have the highest values or how an indicator changed between two years. Answers can include tables and charts, and each answer lists the tools, scripts, files and documents the assistant used.
          </Typography>
        </li>
      </ul>
      <Typography variant="body1" className={classes.contentText}>
        To learn more, visit the <a href="/instructions">Instructions</a> page. It explains how to use each part of the dashboard, from the map controls and the comparison map to the AI assistant and the indicator settings, and includes example questions to ask the assistant.
      </Typography>

      <Box className={classes.buttonContainer}>
        <Button variant="contained" onClick={handleClick}>GO</Button>
      </Box>

    </div>
  );
};

Welcome.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Welcome);
