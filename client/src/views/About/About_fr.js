/* eslint-disable max-len */

import React from 'react';
import withStyles from '@mui/styles/withStyles';
import {Typography} from '@mui/material';
import ExpandPanel from '../../components/ExpandPanel';
import PropTypes from 'prop-types';

const styles = ({
  content: {
    minWidth: '48rem',
    maxWidth: '700px',
    width: '70%',
    margin: '5rem auto',
  },
  contentText: {
    fontFamily: '"Times", "Saira Condensed","Roboto", "Helvetica", "Arial", "sans-serif"',
    fontSize: 16,
    textAlign: 'justify',
    textJustify: 'inter-word',
    marginBottom: '1rem',
  },
  titleText: {
    fontFamily: '"Saira Condensed","Roboto", "Helvetica", "Arial", "sans-serif"',
    margin: '20px 20px 10px 0px',
    color: '#F1815E',
  },
  link: {
    fontFamily: '"Saira Condensed"',
  },
});

// const ListItemLink = (props) => {
//   return <ListItem component="a" {...props} />;
// }

const About = (props) => {
  const {classes} = props;

  return (
    <div className={classes.content}>

      <Typography variant="h6" className={classes.titleText}>
        Le tableau de bord de l&apos;épidémiologie et de la génomique du paludisme au Sénégal (Senegalmeg), c&rsquo;est quoi ?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        <a href="/">Le tableau de bord de l&apos;épidémiologie et de la génomique du paludisme au Sénégal (Senegalmeg)
        </a> est une application web interactive créée pour soutenir la recherche et les décideurs politiques au Sénégal. L&apos;application
        permet de visualiser les données, telles que l&apos;incidence clinique, recueillies par le&nbsp;
        <a href='https://pnlp.sn/' target="_blank" rel="noreferrer">Programme National de Lutte contre le Paludisme (PNLP)</a> ainsi que les estimations
        modélisées du <a href='https://malariaatlas.org/' target="_blank" rel="noreferrer">Projet d&nbsp;Atlas du Paludisme (MAP)</a> au niveau des districts sanitaires.
        Les estimations modélisées de l&apos;incidence à partir de la MAP tiennent compte de biais tels que l&apos;exhaustivité des déclarations et
        les comportements de recherche de traitement. Les données peuvent être comparées par source et dans le temps.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Le tableau de bord comprend également des statistiques sommaires sur les données recueillies par les partenaires de recherche du
        <a href='https://www.cigass.org/' target="_blank" rel="noreferrer">Centre International de recherche et de formation en Génomique
        Appliquée de Surveillance Sanitaire (CIGASS)</a> et les collaborateurs de <a href='https://www.hsph.harvard.edu/wirth-lab/' target="_blank"
          rel="noreferrer">l&apos;Université de Harvard</a> et du <a href='https://www.broadinstitute.org/infectious-disease-and-microbiome/malaria' target="_blank"
          rel="noreferrer">Broad Institute</a> aux États-Unis. Ces données peuvent être superposées aux données déclarées et modélisées pour montrer la
        corrélation entre les schémas des données génomiques et les paramètres épidémiologiques.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Les données déclarées et modélisées sur l&apos;incidence du paludisme sont présentées pour les 79 districts sanitaires pour les années
        2020 à 2022. L&apos;application sera mise à jour au fur et à mesure des années et lorsque quand d&rsquo;autres types de données seront disponibles.
        Les différences d&apos;une année sur l&apos;autre pour la même mesure, ou les différences entre les valeurs rapportées et modélisées peuvent
        également être visualisées.
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Pourquoi avons-nous besoin de Senegalmeg ?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        L&apos;application Senengalmeg a été conçue à l&apos;origine comme un outil permettant aux chercheurs de rassembler des mesures de routine et des
        mesures basées sur la recherche pour répondre aux questions concernant la manière dont les données génomiques pourraient être utilisées
        pour comprendre les changements dans la transmission au Sénégal. Le rôle de la génétique dans la surveillance du paludisme est un sujet
        important pour la communauté du paludisme dans son ensemble (voir&nbsp;
        <a href='https://www.who.int/publications/m/item/WHO-CDS-GMP-MPAC-2019.17' target="_blank" rel="noreferrer">le rapport de consultation technique de l&apos;OMS</a>&nbsp;
        sur le rôle de la génétique des parasites et des anophèles dans la surveillance du paludisme). Ce tableau de bord devrait également être
        utile aux propriétaires des données, le PNLP du Sénégal. Les cartes et les graphiques du tableau de bord permettront au PNLP de suivre
        l&apos;évolution dans le temps par district sanitaire. Cela permettra au PNLP et aux partenaires de recherche d&apos;évaluer l&apos;impact des
        interventions par district et la corrélation entre ces données épidémiologiques et les statistiques génétiques.
      </Typography>


      <Typography variant="h6" className={classes.titleText}>
        Sources des données
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        Les données de routine affichées dans le tableau de bord ont été généreusement partagées par le PNLP, qui produit des&nbsp;
        <a href='https://pnlp.sn/bulletin-epidemiologique-annuel/' target="_blank" rel="noreferrer">
        bulletins épidémiologiques annuels</a> résumant ces données. Les estimations modélisées ont été produites par MAP. Les résultats de MAP
        ont été générés à partir des données des établissements de santé et des postes de santé qui ont été ajustées en fonction des estimations
        infranationales des taux de recours au traitement. Les taux de recherche de traitement sont estimés à partir des données de&nbsp;
        <a href='https://dhsprogram.com/Countries/Country-Main.cfm?ctry_id=36&c=Senegal&Country=Senegal&cn=&r=1' target="_blank" rel="noreferrer">
        l&apos;enquête démographique et sanitaire</a>. Les données génomiques sont collectées auprès de 26 établissements (voir&nbsp;
        <a href='https://www.medrxiv.org/content/10.1101/2023.04.11.23288401v2.full.pdf' target="_blank" rel="noreferrer">méthodes</a>).
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Caractéristiques du tableau de bord
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        Le tableau de bord affiche actuellement l&apos;incidence clinique du paludisme déclarée et modélisée pour les années 2020, 2021 et 2022.
        Les données sur les caractéristiques génétiques sont rapportées pour 2019.
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Quelle est la prochaine étape pour le Sénégal ?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        Les cartes rapportées et modélisées seront publiées chaque mois pour toutes les années pour lesquelles des données sont disponibles.
        L&apos;incertitude des estimations modélisées sera également disponible. D&apos;autres caractéristiques génétiques et d&apos;autres années de données
        seront indiquées au fur et à mesure que les données seront disponible.
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Contributers
      </Typography>

      <ExpandPanel text="David Kong">Frontend development</ExpandPanel>
      <ExpandPanel text="Emily Claps">Backend development</ExpandPanel>
      <ExpandPanel text="Kate Battle">Principle Scientist and Research Lead</ExpandPanel>
      <ExpandPanel text="Joshua Proctor">Principle Scientist and Research</ExpandPanel>
      <ExpandPanel text="Bryan K. Ressler">Frontend development</ExpandPanel>
      <ExpandPanel text="Clark Kirkman IV">Backend development</ExpandPanel>
      <ExpandPanel text="Dejan Lukacevic">Backend development</ExpandPanel>
      <ExpandPanel text="Mandy Izzo">Content management</ExpandPanel>
      <ExpandPanel text="Meikang Wu">Software quality control</ExpandPanel>
      <ExpandPanel text="Minerva Enriquez">Software quality control</ExpandPanel>
      <ExpandPanel text="Sam Buxton">Software quality control</ExpandPanel>
      <ExpandPanel text="Sally Liu">Project management</ExpandPanel>

      <Typography variant="h6" className={classes.titleText}>
        Acknowledgements
      </Typography>

      <ul>
        <li><a href='https://pnlp.sn/' target="_blank" rel="noreferrer">
          Programme National de Lutte contre le Paludisme (PNLP)</a></li>

        <li><a href='https://www.cigass.org/' target="_blank" rel="noreferrer">
          Le Centre International de Recherche et de Formation en Génomique Appliquée et de Surveillance Sanitaire (CIGASS)</a></li>

        <li><a href='https://www.hsph.harvard.edu/wirth-lab/' target="_blank"
          rel="noreferrer">Harvard Université</a></li>

        <li><a href='https://www.broadinstitute.org/infectious-disease-and-microbiome/malaria' target="_blank"
          rel="noreferrer">Broad Institute</a></li>

        <li><a href='https://malariaatlas.org/' target="_blank" rel="noreferrer">Malaria Atlas Project</a></li>

      </ul>

      {/* <OtherDashboardsReference title="SSTIET"/> */}

      <Typography variant="h6" className={classes.titleText}>
        Ressources complémentaires
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
            Questions? Contact <a href="mailto:Kate.Battle@Gatesfoundation.org">Kate.Battle@Gatesfoundation.org</a>
      </Typography>


    </div>);
};

About.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(About);
