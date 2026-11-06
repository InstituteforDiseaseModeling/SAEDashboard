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
        {"Qu'est-ce qu'AIVA Dashboards ?"}
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        <a href="/">AIVA Dashboards</a> {"est un tableau de bord g\u00e9ospatial aliment\u00e9 par l'IA. T\u00e9l\u00e9chargez vos donn\u00e9es CSV, laissez l'agent IA configurer les indicateurs via un flux d'int\u00e9gration guid\u00e9, et explorez les r\u00e9sultats sur des cartes choropl\u00e8thes interactives et des graphiques de s\u00e9ries temporelles."}
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        {"Lorsqu'un utilisateur clique sur une r\u00e9gion dans la carte principale, les graphiques de s\u00e9ries temporelles correspondants s'affichent. Ces graphiques sont synchronis\u00e9s avec des valeurs d'axe Y coh\u00e9rentes, facilitant la comparaison des donn\u00e9es."}
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Pile logicielle
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        {"Le frontend est construit avec React, Material-UI, AmCharts et Leaflet. Le backend se compose de deux services Python FastAPI : un service de donn\u00e9es pour le stockage et la r\u00e9cup\u00e9ration des indicateurs, et un service mind IA qui g\u00e8re les flux d'int\u00e9gration agentiques et analytiques via l'API Anthropic."}
      </Typography>

      <Typography variant="h6" className={classes.titleText}>
        Format de donn&eacute;es
      </Typography>

      <Typography variant="body1" className={classes.contentText}>
        {"Les fichiers CSV d'indicateurs suivent une convention de nommage avec quatre parties s\u00e9par\u00e9es par des doubles underscores : pays, indicateur, sous-groupe et num\u00e9ro de version."}
      </Typography>
      <code>
        &nbsp;&nbsp;&nbsp;[pays] + &quot;__&quot; + [indicateur] + &quot;__&quot; + [sous-groupe] + &quot;__&quot; + [version] + .csv
      </code>
      <br/><br/>

      <Typography variant="body1" className={classes.contentText}>
        Les fichiers CSV doivent contenir les colonnes suivantes :
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{maxWidth: 800}} aria-label="tableau format">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">colonne</StyledTableCell>
              <StyledTableCell align="left">description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell align="left">state</StyledTableCell>
              <StyledTableCell align="left">nom de la r&eacute;gion infranationale (adm1 ou adm2)</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">year</StyledTableCell>
              <StyledTableCell align="left">{"valeur de l'ann\u00e9e"}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred</StyledTableCell>
              <StyledTableCell align="left">valeur de pr&eacute;diction</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred_upper</StyledTableCell>
              <StyledTableCell align="left">{"borne sup\u00e9rieure de l'intervalle de confiance"}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">pred_lower</StyledTableCell>
              <StyledTableCell align="left">{"borne inf\u00e9rieure de l'intervalle de confiance"}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">[nom_indicateur]</StyledTableCell>
              <StyledTableCell align="left">{"valeur de r\u00e9f\u00e9rence"}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">se.[nom_indicateur]</StyledTableCell>
              <StyledTableCell align="left">{"erreur standard de r\u00e9f\u00e9rence"}</StyledTableCell>
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
