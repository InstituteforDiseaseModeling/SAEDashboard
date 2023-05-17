import React from 'react';
import {Typography} from '@mui/material';
import {Link} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';

const styles = ({

  titleText: {
    fontFamily: '"Saira Condensed","Roboto", "Helvetica", "Arial", "sans-serif"',
    margin: '20px 20px 10px 0px',
    color: '#F1815E',
  },
  link: {
    fontFamily: '"Saira Condensed"',
  },

});

const OtherDashboardsReference = (props) => {
  const {classes} = props;

  return (
    <>
      <Typography variant="h6" className={classes.titleText}>
        Example of SAEDashboard
      </Typography>
      <ul>
        <li>
          <Link href='https://sfpet.bmgf.io' target='_blank'>
            Subnational Family Planning Estimation Tool (SFPET)
          </Link>
        </li>
      </ul>
    </>

  );
};

OtherDashboardsReference.propTypes = {
  classes: PropTypes.any,
  title: PropTypes.string,
};

export default withStyles(styles)(OtherDashboardsReference);
