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
        Other Subnational Area Estimation Dashboards
      </Typography>
      <ul>
        {props.title != 'SFPET' &&
          <li>
            <Link href='https://sfpet.bmgf.io' target='_blank'>
              Subnational Family Planning Estimation Tool (SFPET)
            </Link>
          </li>
        }
        {props.title != 'SSTIET' &&
          <li>
            <Link href='https://sstiet.bmgf.io' target='_blank'>
              Subnational Sexually Transmitted Infection Estimation Tool (SSTIET)
            </Link>
          </li>
        }
        {props.title != 'SERII' &&
          <li>
            <Link href='https://serii.bmgf.io' target='_blank'>
              Subnational estimation of routine immunization (SERII)
            </Link>
          </li>
        }
        {props.title != 'SEUNRI' &&
          <li>
            <Link href='https://seunri.bmgf.io' target='_blank'>
              Subnational estimation of women with unmet need interacting with the health
               system via routine immunization (SEUNRI)
            </Link>
          </li>
        }
        {props.title != 'SEVPKenya' &&
          <li>
            <Link href='https://sevpkenya.bmgf.io' target='_blank'>
              Subnational estimation of vulnerable populations in Kenya (SEVPKenya)
            </Link>
          </li>
        }
      </ul>
    </>

  );
};

OtherDashboardsReference.propTypes = {
  classes: PropTypes.any,
  title: PropTypes.string,
};

export default withStyles(styles)(OtherDashboardsReference);
