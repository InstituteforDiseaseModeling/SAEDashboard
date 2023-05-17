import React from 'react';
import data from '../data/output.json';
import beData from '../data/licenses.json';
import {Table, TableCell, TableHead, TableRow, Typography} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

const styles = ({
  root: {
    'margin': '70px auto 0px',
    'width': 'fit-content',
    '& th': {
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    '& td': {
      maxWidth: 250,
      overflowWrap: 'break-word',
    },
  },
  titleText: {
    paddingTop: 10,
    paddingLeft: 15,
    fontFamily: '"Saira Condensed","Roboto", "Helvetica", "Arial", "sans-serif"',
    margin: '20px 20px 10px 0px',
    color: '#F1815E',
  },


  header: {

  },

});

const Libraries = ({classes}) => {
  const convert2Link = (link) => {
    if (link && link.startsWith('http')) {
      return (<a href={ link } target='_blank'
        className={classes.link} rel="noreferrer">{link}</a>);
    } else {
      return (link);
    }
  };

  const feLibraries = _.sortBy(data, (i)=>{
    return i[5].toLowerCase();
  });
  const beLibraries = _.sortBy(beData, (i)=>{
    return i.Name.toLowerCase();
  });

  return (
    <div className={classes.page}>
      <div className={classes.root}>

        <Typography variant="h6" className={classes.titleText}>Frontend libraries</Typography>
        <Table>
          <TableHead>
            <TableCell>name/Author</TableCell>
            <TableCell>license</TableCell>
            <TableCell>version</TableCell>
            <TableCell>url</TableCell>
            <TableCell>github</TableCell>
          </TableHead>
          {
            feLibraries.map((library) => {
              return (
                <TableRow key={library[0]}>
                  <TableCell> {library[5]} </TableCell>
                  <TableCell> {library[2]} </TableCell>
                  <TableCell> {library[1]} </TableCell>
                  <TableCell> {convert2Link(library[4])} </TableCell>
                  <TableCell> {convert2Link(library[3])} </TableCell>
                </TableRow>
              );
            })
          }
        </Table>

        <Typography variant="h6" className={classes.titleText}>Backend libraries</Typography>
        <Table>
          <TableHead>
            <TableCell>name/author</TableCell>
            <TableCell>license</TableCell>
            <TableCell>version</TableCell>
            <TableCell>url</TableCell>
          </TableHead>
          {
            beLibraries.map((library) => {
              return (
                <TableRow key={library[0]}>
                  <TableCell> {library.Name} - {library.Author} </TableCell>
                  <TableCell> {library.License} </TableCell>
                  <TableCell> {library.Version} </TableCell>
                  <TableCell> {convert2Link(library.URL)} </TableCell>
                </TableRow>
              );
            })
          }
        </Table>

      </div>
    </div>);
};

Libraries.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Libraries);
