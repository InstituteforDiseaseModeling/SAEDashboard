/* eslint-disable max-len */
import React from 'react';
import {styled} from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import {TableContainer, Typography, Table, TableHead, TableRow, TableBody, Paper} from '@mui/material';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import PropTypes from 'prop-types';

const styles = ({
  content: {
    minWidth: '48rem',
    maxWidth: '700px',
    width: '70%',
    margin: '5rem auto',
  },
  contentText: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    fontSize: 16,
    textAlign: 'justify',
    textJustify: 'inter-word',
    marginBottom: '1rem',
  },
  titleText: {
    fontFamily: '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    margin: '20px 20px 10px 0px',
    color: '#F85C02',
  },
});

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#313A44',
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
        What is SAE Dashboards?
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        <a href="/">SAE Dashboards</a> is an AI-powered geospatial indicator dashboard.
        Upload your CSV data, let the AI agent configure indicators through a guided
        onboarding flow, and explore results on interactive choropleth maps and time series charts.
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        When a user clicks on a region within the main map, corresponding
        time series charts are displayed. These charts are synchronized with consistent y-axis values,
        facilitating straightforward data comparison. Users can set specific lower
        and upper bounds for the y-axis to visualize confidence intervals.
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Software stack
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        The frontend is built with React, Material-UI, Plotly, and Leaflet.
        The backend consists of two Python FastAPI services: a data service for indicator
        storage and retrieval, and an AI mind service that handles the agentic onboarding
        and analytical workflows using a configurable large language model (LLM) provider.
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Data Format
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        Indicator CSV files follow a naming convention with four parts separated by double
        underscores: country, indicator, subgroup, and version number.
      </Typography>
      <code>
        &nbsp;&nbsp;&nbsp;[country] + &quot;__&quot; + [indicator] + &quot;__&quot; + [subgroup] + &quot;__&quot; + [version] + .csv
      </code>
      <br/><br/>

      <Typography variant="body1" className={classes.contentText}>
        CSV files should contain the following columns:
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{maxWidth: 800}} aria-label="data format table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">column</StyledTableCell>
              <StyledTableCell align="left">description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell align="left">state</StyledTableCell>
              <StyledTableCell align="left">subnational region name (adm1 or adm2)</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">year</StyledTableCell>
              <StyledTableCell align="left">year value</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred</StyledTableCell>
              <StyledTableCell align="left">prediction value</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred_upper</StyledTableCell>
              <StyledTableCell align="left">upper bound of confidence interval</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred_lower</StyledTableCell>
              <StyledTableCell align="left">lower bound of confidence interval</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">[indicator_name]</StyledTableCell>
              <StyledTableCell align="left">reference value (shown as bullet in chart)</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">se.[indicator_name]</StyledTableCell>
              <StyledTableCell align="left">standard error for reference</StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>

    </div>);
};

About.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(About);
