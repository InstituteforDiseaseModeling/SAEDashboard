import React from 'react';
import withStyles from '@mui/styles/withStyles';
// import idmlogo from '../../image/idmlogo55.png';
// import bmgfLogo from '../../image/bmgf-logo-white.png';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  footer: {
    textAlign: 'center',
    borderTop: '1px solid #bcc6cc',
    position: 'fixed',
    bottom: '0',
    zIndex: 2000,
    width: '100% !important',
    backgroundColor: 'white',
    display: 'flex',
    left: 0,
    maxHeight: 65,
  },
  nav: {
    '-ms-flexbox': 1,
    'display': 'flex',
    '-webkit-box-pack': 'justify',
    '-webkit-justify-content': 'space-between',
    '-ms-flex-pack': 'justify',
    'justify-content': 'space-between',
    'width': '100%',
    'backgroundColor': '#24323c',
    'paddingLeft': 50,
  },
  cite:
  {
    display: 'flex',
    flexDirection: 'column',
    justifyItem: 'center',
    alignContent: 'center',
    position: 'relative',
    margin: '16px 15px',
    overflow: 'hidden',
  },
  idmlogo: {
    display: 'inline-block',
    margin: '15px 18px 10px 25px',
    height: 35,
    right: 0,
    [theme.breakpoints.down('md')]: {
      maxWidth: 35,
      objectFit: 'cover',
      objectPosition: 'left',
      margin: '15px 3px',
    },
  },
  bmgflogo: {
    display: 'inline-block',
    margin: '15px 18px 10px 25px',
    height: 35,
    right: 0,
    [theme.breakpoints.down('md')]: {
      height: 25,
      margin: '18px 5px',
    },
  },
  link: {
    'width': '100%',
    'display': 'inline-block',
    'position': 'relative',
    'margin': '0px 15px 0px 15px',
    'fontSize': 14,
    'textAlign': 'right',
    'color': '#b8860b',
    'overflow': 'hidden',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
    '-webkit-flex-shrink': 2,
    '-ms-flex-negative': 2,
    'flex-shrink': 2,
    'fontStyle': 'normal',
    [theme.breakpoints.down('md')]: {
      fontSize: 11,
      margin: '0px 0px',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexStart: 'flex-end',
    margin: '14px 15px',
    [theme.breakpoints.down('md')]: {
      margin: '14px 0px',
    },
  },
  leftrow: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: '',
    minWidth: 200,
  },
  rightrow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'no',
  },
  copyText: {
    'fontSize': 14,
    'color': '#b1bcc5',
    'overflow': 'hidden',
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
    '-webkit-flex-shrink': 2,
    '-ms-flex-negative': 2,
    'flex-shrink': 2,
    'textAlign': 'center',
    [theme.breakpoints.down('md')]: {
      fontSize: 11,
    },
  },
});

/**
 * Footer component
 * @param {*} props
 * @return {*}
 */
const Footer = (props) => {
  const {classes} = props;
  return (
    <div className={classes.footer}>
      <nav className={classes.nav}>
        {/* <div className={classes.leftrow}>
          <a href="https://gatesfoundation.org" target="blank">
            <img src={bmgfLogo} title="Bill & Melinda Gates foundation" alt={'IDMlogo'}
              className={classes.bmgflogo} />
          </a>

          <cite className={classes.cite}
            title={'No reproduction or distribution without written permission of ' +
            'Bill & Melinda Gates foundation. Attribution-Noncommercial-ShareAlike 4.0 License.'}>
            <div className={classes.copyText}>
              &copy; 1999-2023 Bill & Melinda Gates Foundation.
            </div>
            <div className={classes.copyText}>All Rights Reserved.</div>
          </cite>

        </div> */}
        {/* <div className={classes.rightrow}>
          <div className={classes.column}>
            <a href="https://www.gatesfoundation.org/Terms-of-Use" target="_blank"
              className={classes.link}
              rel="noopener noreferrer">Terms of use</a>
            <a href="https://www.gatesfoundation.org/Privacy-and-Cookies-Notice" target="_blank"
              rel="noopener noreferrer"
              className={classes.link}>Privacy & Cookies Notice</a>
          </div>
          <a href="http://www.idmod.org" target="blank">
            <img src={idmlogo} title="Institute for Disease Modeling" alt={'IDMlogo'}
              className={classes.idmlogo} />
          </a>
        </div> */}
      </nav>
    </div>
  );
};

Footer.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Footer);
