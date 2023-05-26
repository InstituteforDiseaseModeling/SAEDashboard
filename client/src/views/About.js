/* eslint-disable max-len */
import React from 'react';
import {styled} from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import {TableContainer, Typography, Table, TableHead, TableRow, TableBody, Paper} from '@mui/material';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import {Link} from '@mui/material';
import ExpandPanel from '../components/ExpandPanel';
import OtherDashboardsReference from '../components/OtherDashboardsReference';
import PropTypes from 'prop-types';
import ArchitectureImage from '../image/architecture.jpeg';
import DataImage from '../image/data.jpeg';

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
  image: {
    maxWidth: 800,
  },

});

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1976d2',
    color: theme.palette.common.white,
    lineHeight: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    lineHeight: 0.7,
  },
}));

const About = (props) => {
  const {classes} = props;

  return (
    <div className={classes.content}>

      <Typography variant="h6" className={classes.titleText}>
        What is the Small area estimation dashboard (SAEDashboard)?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        The <a href="/">Small area estimation dashboard (SAEDashboard)</a> is an interactive web application
        designed to help users visualize map model data using a map chart. The dashboard currently supports
        admin level 1 and 2 regions and allows users to explore and compare categorized model data using
        indicators and subgroups.
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        By clicking on a region in the main map, users can view the corresponding time series charts,
        which are synchronized with the same y-axis values to facilitate data comparison.
        The charts also allow users to set specific lower and upper bounds of y-axis values for
        visualizing confidence intervals.
      </Typography>


      {/* <Typography variant="body1" className={classes.contentText}>
        The tool displays estimates of family planning indicators of unmet need, use of traditional contraceptive methods,
        and use of modern contraceptive methods at the first and second administration level for 26 sub-Saharan countries.
        Estimates are disaggregated across demographic subgroups, including age, parity, and urban-rural status,
        allowing the user to investigate subnational heterogeneities and identify the most underserved demographic groups.
      </Typography> */}

      {/* <Typography variant="h6" className={classes.titleText}>
        Why do we need SFPET?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        Access to family planning is a powerful enabler of gender equality, providing women with the tools to control their health and reproductive futures. When women have the option to make informed reproductive choices, families—and entire communities—can begin to break out of poverty cycles.
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        Recognition of the importance of family planning resources has led to numerous programs—often with ambitious goals—to increase equity in access.  From national agencies to global partnerships such as FP2030 (formerly FP2020, <a href="https://fp2030.org/about" target="_blank" rel="noreferrer">https://fp2030.org/about</a>), organizations and funders have invested heavily in setting and achieving quantitative targets while moving towards universal voluntary access to modern contraceptives. Recognized as a ubiquitous necessity by the United Nations, family planning goals are even included in the UN’s <a href="https://sdgs.un.org/goals" target="_blank" rel="noreferrer">Sustainable Development Goals (SDG)</a>.
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        Model-based frameworks and estimates have been an important tool for monitoring progress at the national scale, such as the family planning estimation tool (<a href="http://www.track20.org/pages/data_analysis/publications/methodological/family_planning_estimation_tool.php" target="_blank" rel="noreferrer">FPET</a>). Assessing programmatic success on a national level often obscures subnational heterogeneities, and masks differences in particular sub-populations or segments of women. Understanding where variation and uncertainty occur greatly improves targeting of policy, which better serves under-represented sections of the population.  The modeling framework used here in SFPET utilizes a more data-driven approach using a Bayesian methodology to leverage complex survey data at the micro-scale incorporating in-sample and out-of-sample uncertainty. This approach allows us to estimate and forecast levels and trends of family planning indicators at subnational scales and provides insight into different segments of women. The ability to examine trends at subnational levels makes this tool an asset in identifying demographic groups in highest need of advocacy or programmatic targeting.
      </Typography> */}

      <Typography variant="h6" className={classes.titleText}>
        Software stack
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        The client website is built using various open-source JavaScript libraries, including ReactJS.
        The conversion layer of the system is developed in Python. Prior to being consumed by the API,
        raw model data undergoes a thorough cleansing and packaging process, which is currently performed
        manually whenever new data becomes available.
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        The API service layer is also implemented in Python, serving as a RESTful API that the website
        uses to access model data.
      </Typography>

      {/* <Typography variant="body1" className={classes.contentText}>
        This tool utilizes the methods described in <a href='https://www.medrxiv.org/content/10.1101/2021.03.03.21252829v1' target="_blank" rel="noreferrer">
          https://www.medrxiv.org/content/10.1101/2021.03.03.21252829v1</a> and expands the analysis by enabling the user to explore bespoke scenarios.
            The modeling framework underlying the dashboard utilizes Bayesian methodology to leverage complex survey data without imposing underlying functional forms.
      </Typography> */}
      <img src={ArchitectureImage} />

      <Typography variant="h6" className={classes.titleText}>
        Data Format
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        SAEDashboard uses the following naming standard for filenames.  E.g. Senegal__traditional_method__all__1.csv
      </Typography>
      <code>
        &nbsp;&nbsp;&nbsp;[country] + &quot;__&quot; + [indicator] + &quot;__&quot; + [subgroup] + [number] + .csv
      </code>
      <br/>
      <br/>

      {/* todo: add missing columns */}
      <Typography variant="body1" className={classes.contentText}>
        For content of the csv file, it should have the following columns
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{maxWidth: 800}} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">column</StyledTableCell>
              <StyledTableCell align="left">description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell align="left">subgroup</StyledTableCell>
              <StyledTableCell align="left">name of the subgroup</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">state</StyledTableCell>
              <StyledTableCell align="left">name of the subnational region.  It can be either adm1 or adm2 name</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">year</StyledTableCell>
              <StyledTableCell align="left">year value</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred</StyledTableCell>
              <StyledTableCell align="left">predication value</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred_upper</StyledTableCell>
              <StyledTableCell align="left">upper bound of confidence value</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred_lower</StyledTableCell>
              <StyledTableCell align="left">lower bound of confidence value</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">model</StyledTableCell>
              <StyledTableCell align="left">version of model</StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <img src={DataImage} className={classes.image}/>

      {/* <Typography variant="h6" className={classes.titleText}>
        Dashboard features
      </Typography>
      <Typography variant="body1" className={classes.contentText}>
        This information-rich dashboard includes output from 1990 – 2025 and provides confidence intervals and standard errors around estimates. Users can not only explore customized scenarios but can also create custom comparisons to further delve into areas of interest.  All dashboard output can be saved and exported.
      </Typography> */}


      <Typography variant="h6" className={classes.titleText}>
        Contributors
      </Typography>
      <ExpandPanel text="Bryan K. Ressler">Frontend development</ExpandPanel>
      <ExpandPanel text="Clark Kirkman IV">Backend development</ExpandPanel>
      <ExpandPanel text="David Kong">Frontend development</ExpandPanel>
      <ExpandPanel text="Dejan Lukacevic">Backend development</ExpandPanel>
      <ExpandPanel text="Emily Claps">Backend development</ExpandPanel>
      <ExpandPanel text="Joshua Proctor">Principal Scientist and Research Lead</ExpandPanel>
      <ExpandPanel text="Mandy Izzo">Content management</ExpandPanel>
      <ExpandPanel text="Meikang Wu">Software quality control</ExpandPanel>
      <ExpandPanel text="Minerva Enriquez">Software quality control</ExpandPanel>
      <ExpandPanel text="Sam Buxton">Software quality control</ExpandPanel>
      <ExpandPanel text="Sally Liu">Project management</ExpandPanel>

      <Typography variant="h6" className={classes.titleText}>
        Acknowledgements
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        We would like to thank our former coworkers Fred Lu, Laina Mercer and Qinghua Long, for their contributions to this project.
      </Typography>

      <OtherDashboardsReference title= "SFPET"/>

      <Typography variant="h6" className={classes.titleText}>
        Additional resources
      </Typography>

      <ul>
        <li>
          <Typography variant="body1" className={classes.contentText}>
            Questions? Contact <Link href="mailto:Josh.Proctor@Gatesfoundation.org">Josh.Proctor@Gatesfoundation.org</Link>
          </Typography>
        </li>

        <li>
          <Typography variant="body1" className={classes.contentText}>
            <Link href="https://github.com/InstituteforDiseaseModeling/SmallAreaEstimationForSurveyIndicators" target="_blank">
              Small Area Estimation Model GitHub Repository
            </Link>
          </Typography>
        </li>

        <li>
          <Typography variant="body1" className={classes.contentText}>
            <Link href="https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-019-8043-z" target="_blank">
              Estimating the levels and trends of family planning indicators in 436 sub-national areas across 26 countries in sub-Saharan Africa (methods paper)
            </Link>
          </Typography>
        </li>
        <li>
          <Typography variant="body1" className={classes.contentText}>
            <Link href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6937659/" target="_blank">
            Sub-national levels and trends in contraceptive prevalence, unmet need, and demand for family planning in Nigeria with survey uncertainty
            </Link>
          </Typography>
        </li>
      </ul>

    </div>);
};

About.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(About);
