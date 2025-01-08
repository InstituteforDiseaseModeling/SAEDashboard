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
        Bienvenue sur le tableau de bord de l&apos;épidémiologie et de la génomique du paludisme au Sénégal      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Ce tableau de bord a été conçu pour permettre la visualisation des données de surveillance de routine du paludisme ainsi que des données de surveillance moléculaire du paludisme. Des indicateurs climatiques et entomologiques sont inclus pour fournir un contexte à la transmission du paludisme dans les différentes régions du pays. Des données modélisées qui traitent des biais courants dans les données rapportées sont également incluses. Voir la page <Link href='/about'>À PROPOS</Link> pour plus d&apos;informations.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Le Sénégal a un climat tropical caractérisé par des saisons sèches et humides distinctes, qui influencent considérablement les schémas de transmission du paludisme dans le pays. Le pays est plus sec au nord et plus humide au sud. La saison des pluies (juin-octobre) apporte des précipitations plus importantes dans le sud, tandis que la saison sèche (novembre-mai) domine le nord avec des conditions arides et des vents d&apos;harmattan.
      </Typography>
      <Typography className={classes.contentText}>
        Au Sénégal, le paludisme est étroitement lié à la saison des pluies. L&apos;intensité de la transmission varie géographiquement : la transmission est plus élevée dans les régions du sud et du sud-est (par exemple, Kolda, Kedougou) et plus faible dans les régions sahéliennes du nord (par exemple, Saint-Louis), où le climat sec limite les populations de moustiques.
      </Typography>
      <img src="/ComparePrecipTempFr.png" className={classes.image} alt='Precipitation and temperature plots'/>

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
