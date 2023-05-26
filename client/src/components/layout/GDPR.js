// ==============================================================================
// GDPR - an adaptation of BMGF's standard GDPR notice gizmo.
//
// Written by Bryan Ressler, IDM.
//
// NOTE: Don't change the verbiage, urls, or cookie parameters without approval.
// The cookie code came directly from BMGF.
// ==============================================================================

import React, {Fragment, useEffect, useState} from 'react';
import {Snackbar, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';

// ==============================================================================
// Styles (see also attributionOverlay.css)
// ==============================================================================
const useStyles = makeStyles({
  head: {
    textTransform: 'uppercase',
    marginTop: 0,
  },
  content: {
    textAlign: 'center',
  },
  button: {
    textTransform: 'uppercase',
    textDecoration: 'underline',
  },
  buttonArea: {
    marginTop: 12,
    textAlign: 'center',
  },
});

// ==============================================================================
// GDPR
// ==============================================================================
export default function GDPR(props) {
  const classes = useStyles(props);
  const [open, setOpen] = useState(false);


  // ----------------------------------------------------------------------------
  function needGDPRNotice() {
    return getCookie('PrivacyPolicy') === '';
  }

  // ----------------------------------------------------------------------------
  function getCookie(cname) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  // ----------------------------------------------------------------------------
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=true;' + expires + ';path=/';
  }

  // ----------------------------------------------------------------------------
  function _onAgreeClick() {
    setCookie('PrivacyPolicy', 'true', 365);
    setOpen(false);
  }

  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (needGDPRNotice()) {
      setOpen(true);
    }
  }, [setOpen]);

  // ----------------------------------------------------------------------------
  const pixelFromBottom = props.pixelFromBottom ? props.pixelFromBottom : 24;

  return (
    <div>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={open} className={classes.content} style={{bottom: pixelFromBottom}}
        message={
          <Fragment>
            <h3 className={classes.head}>Please review our updated privacy & cookies notice</h3>
            <Typography variant="body2">This site uses cookies and similar
              technologies to store information on your computer or device. By
              continuing to use this site, you agree to the placement of these
              cookies and similar technologies. Read our updated &nbsp;
            <a href="https://www.gatesfoundation.org/Privacy-and-Cookies-Notice" target="_blank" rel="noopener noreferrer">Privacy & Cookies Notice</a> to learn more.
            </Typography>
            <div className={classes.buttonArea}>
              <Button variant="contained" color="primary" className={classes.button} onClick={_onAgreeClick}>I Agree</Button>
            </div>
          </Fragment>
        }/>
    </div>
  );
}
