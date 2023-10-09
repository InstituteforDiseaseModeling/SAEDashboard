/* eslint-disable max-len */

import React from 'react';
import withStyles from '@mui/styles/withStyles';
import {Typography} from '@mui/material';
import ExpandPanel from '../../components/ExpandPanel';
import OtherDashboardsReference from '../../components/OtherDashboardsReference';
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
        What is Senegal Malaria Epidemiology & Genomics Dashboard (Senegalmeg)?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        The <a href="/">Senegal Malaria Epidemiology & Genomics Dashboard (Senegalmeg)
        </a> is an interactive web application created to support researchers and policy makers in Senegal.
        The app allows data, such as clinical incidence, gathered by the <a href='https://pnlp.sn/' target="_blank" rel="noreferrer">
        National Malaria Control Program (PNLP)</a> to be
        visualized alongside modeled estimates from the <a href='https://malariaatlas.org/' target="_blank" rel="noreferrer">Malaria Atlas Project (MAP)</a> at the health district level.
        Modelled estimates of incidence from MAP account for biases such as reporting completeness and treatment-seeking behaviors.
        Data can be compared by source and across time.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Summary statistics of data gathered from research partners at <a href='https://www.cigass.org/' target="_blank" rel="noreferrer">
        International Research Training Center on Genomics and Health
        Surveillance (CIGASS)</a> and collaborators at <a href='https://www.hsph.harvard.edu/wirth-lab/' target="_blank"
          rel="noreferrer">Harvard University</a> and the <a href='https://www.broadinstitute.org/infectious-disease-and-microbiome/malaria' target="_blank"
          rel="noreferrer">Broad Institute</a> in the U.S. are also included in the
        dashboard. These data can be overlaid on the reported and modeled data to show how patterns in genomic data correlate with
        epidemiological metrics.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        Reported and modeled malaria incidence data are shown for all 79 health districts for the years 2020 through 2022. The app will be
        updated as additional years and data types are made available. Difference from year to year for the same metric, or differences
        between reported and modeled values can also be visualized.
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Why do we need Senegalmeg?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        The Senengalmeg application was originally conceived as a tool for researchers to bring together routine and research-based metrics
        to address the questions regarding how genomic data could be used to understand changes in transmission in Senegal. The role of genetics
        in malaria surveillance is a topic of importance to the malaria community as a whole (see&nbsp;
        <a href='https://www.who.int/publications/m/item/WHO-CDS-GMP-MPAC-2019.17' target="_blank" rel="noreferrer">WHO technical consultation report</a>&nbsp;
        on the role of parasite and anopheline genetics in malaria surveillance). This dashboard should also be of use to the owners of the data, the Senegal
        PNLP. The maps and plots in the dashboard will allow the PNLP to track changes over time by health district. This will allow the PNLP
        and research partners to assess the impact of interventions by district and how those correlate with genetic summary statistics.
      </Typography>


      <Typography variant="h6" className={classes.titleText}>
        Data sources
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        The routine data displayed in the dashboard were generously shared by the PNLP, which produces <a href='https://pnlp.sn/bulletin-epidemiologique-annuel/' target="_blank" rel="noreferrer">
          annual epidemiological bulletins</a> summarizing this data. Modeled estimates were produced by MAP. MAP outputs were generated from health facility
        and health post level data that adjusted
        for by subnational estimates of treatment-seeking rates. Treatment-seeking rates are estimated from&nbsp;
        <a href='https://dhsprogram.com/Countries/Country-Main.cfm?ctry_id=36&c=Senegal&Country=Senegal&cn=&r=1' target="_blank" rel="noreferrer">
          DHS survey data</a>. Genomic data are collected from 26 facility sites (see <a href='https://www.medrxiv.org/content/10.1101/2023.04.11.23288401v2.full.pdf' target="_blank" rel="noreferrer">methods</a>).
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Dashboard features
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        The dashboard currently displays reported and model clinical incidence of malaria for the years 2020, 2021, and 2022. Genetic feature data are reported for 2019.
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        What’s next for Senegalmeg?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
      Reported and modeled maps will be made monthly for all years where data are available. Uncertainty for modeled estimates will also be made available. Additional genetic features
      and years of data will be shown as data are made available.
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

        <li><a href='https://www.hsph.harvard.edu/wirth-lab/' target="_blank" rel="noreferrer">
          Harvard University</a></li>

        <li><a href='https://www.broadinstitute.org/infectious-disease-and-microbiome/malaria' target="_blank" rel="noreferrer">
          Broad Institute</a></li>

        <li><a href='https://malariaatlas.org/' target="_blank" rel="noreferrer">Malaria Atlas Project</a></li>

      </ul>

      <OtherDashboardsReference title="SSTIET"/>

      <Typography variant="h6" className={classes.titleText}>
        Additional resources
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
