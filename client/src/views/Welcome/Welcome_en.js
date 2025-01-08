/* eslint-disable max-len */
import React from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import {Typography, Button, Box, Link} from '@mui/material';


const styles = ({
  content: {
    maxWidth: '700px',
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
});

const Welcome = ({classes}) => {
  const handleClick = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className={classes.content}>
      <Typography variant="h6" className={classes.titleText}>
        Welcome to the Senegal Malaria Epidemiology & Genomics Dashboard
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        This dashboard has been designed to allow the visualization of routine malaria surveillance data alongside malaria molecular surveillance data. Climate and entomological indicators are included to provide context for malaria transmission in different parts of the country. Modeled data that address common biases in reported data are also included. See <Link href='/about'>ABOUT</Link> page for more information.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Senegal is Senegal has a tropical climate characterized by distinct wet and dry seasons,
        which significantly influence the country&apos;s malaria transmission patterns. The country is drier in the north and more humid in the south. The rainy season (June–October) brings higher rainfall in the south, while the dry season (November–May) dominates the north with arid conditions and harmattan winds.
      </Typography>
      <div className={classes.contentText}>
        Malaria in Senegal is closely tied to the rainy season. Transmission intensity varies geographically: higher transmission is in the southern and southeastern regions (e.g., Kolda, Kedougou) and lower transmission occurs in the northern Sahelian regions (e.g., Saint-Louis), where the dry climate limits mosquito populations.
      </div>
      <img src="/ComparePrecipTempEn.png" className={classes.image} alt='Precipitation and temperature plots'/>

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
