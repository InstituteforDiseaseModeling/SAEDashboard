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
        Bienvenue sur le Outil d’estimation de la planification familiale infranationale
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Ce dépôt contient un tableau de bord cartographique qui affiche des données au niveau infranational : résultats de modèles, données de surveillance et autres données géospatiales et temporelles. Il peut être configuré pour afficher différents types de données sur des cartes et dans le temps. Les données d’exemple fournies présentent les résultats d’un modèle de planification familiale au Sénégal.
      </Typography>

      <Typography variant="h6" className={classes.sectionTitle}>
        Assistant IA
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Le tableau de bord comprend un assistant IA qui vous aide à ajouter vos propres données et à les explorer en langage courant. Ouvrez-le avec le bouton IA (une bulle avec une étincelle) en haut à droite de la page Tableau de bord. Il s’ouvre dans un panneau à côté des cartes : vous pouvez donc continuer à utiliser le tableau de bord pendant que vous l’utilisez. Le panneau comporte trois onglets :
      </Typography>
      <ul className={classes.list}>
        <li>
          <Typography className={classes.listText}>
            <b>Liste</b> – consultez les indicateurs gérés par l’assistant et leurs détails. Vous pouvez afficher ou masquer vos propres indicateurs sur le tableau de bord, les télécharger ou les supprimer.
          </Typography>
        </li>
        <li>
          <Typography className={classes.listText}>
            <b>Ajouter</b> – transformez un fichier CSV ou Excel en un nouvel indicateur du tableau de bord. Téléversez le fichier : l’assistant le vérifie et vous guide dans les réglages de l’indicateur, comme son nom, ses sous-groupes et son thème de couleurs, avant de l’ajouter à la carte.
          </Typography>
        </li>
        <li>
          <Typography className={classes.listText}>
            <b>Analyser</b> – posez des questions sur les indicateurs, par exemple quels districts ont les valeurs les plus élevées ou comment un indicateur a évolué entre deux années. Les réponses peuvent contenir des tableaux et des graphiques, et chaque réponse indique les outils, scripts, fichiers et documents utilisés par l’assistant.
          </Typography>
        </li>
      </ul>
      <Typography variant="body1" className={classes.contentText}>
        Selon la façon dont le tableau de bord est déployé, vous devrez peut-être saisir une clé API pour le fournisseur de modèle d’IA (LLM) qu’il utilise, avec l’icône de clé du panneau. L’assistant ne donne pas toujours la réponse attendue : vérifiez ses résultats et posez des questions de suivi si nécessaire.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Pour en savoir plus, consultez la page <a href="/instructions">Instructions</a>. Elle explique comment utiliser chaque partie du tableau de bord, des commandes de la carte et de la carte comparative à l’assistant IA et aux paramètres des indicateurs, et propose des exemples de questions à poser à l’assistant.
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
