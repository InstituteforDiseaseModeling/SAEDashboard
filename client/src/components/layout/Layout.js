import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  AppBar, IconButton, Menu, MenuItem, Toolbar, Typography,
  Snackbar, Select,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import MenuIcon from '@mui/icons-material/Menu';
import Footer from './Footer';
import Dashboard from '../../views/Dashboard';
import About from '../../views/About';
import Libraries from '../../views/Libraries';
import SnackbarContentWrapper from '../uielements/SnackBarContentWrapper';
import {showStop} from '../../redux/actions/messaging';
import PropTypes from 'prop-types';
import {changeLanguage} from '../../redux/actions/filters';
import {IntlProvider, FormattedMessage} from 'react-intl';
import * as translations from '../../data/translation';

const styles = (theme) => ({
  root: {
    marginBottom: 100,
  },
  grow: {
    flexGrow: 1,
  },
  content: {
    display: 'block', // Fix IE 11 issue.
    marginTop: 40,
    [theme.breakpoints.up(1500 + theme.spacing(3 * 2))]: {
      width: '100%',
      marginRight: 'auto',
    },
  },
  appbar: {
    position: 'fixed',
    backgroundColor: '#24323c',
  },
  menu: {
    'margin-top': 30,
    'padding-top': 0,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuItem: {
    '& li p': {fontSize: 'large'},
  },
  github: {
    cursor: 'pointer',
    color: 'white',
  },
});

/**
 * Layout component
 * @param {} props
 * @returns
 */

const Layout = (props) => {
  const {classes} = props;
  const [selectedView, setSelectedView] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState(null);
  const variant = useSelector((state) => state.showMsg.variant);
  const infoMsg = useSelector((state) => state.showMsg.msg);
  const showMsg = useSelector((state) => state.showMsg.open);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const dispatch = useDispatch();

  const menuEntries = [
    {urlFrag: 'dashboard', id: 'dropdown_dashboard'},
    {urlFrag: 'about', id: 'dropdown_about'},
    {urlFrag: 'libraries', id: 'dropdown_lib'},

  ];

  const showView = (target) => {
    return (() => {
      setAnchorEl(null);
      setSelectedView(target);
      window.location.href = '/#/' + target;
    });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = (url) => {
    setAnchorEl(null);
    if (url !== undefined) {

    }
  };

  const handleSnackBarClose = (event) => {
    dispatch(showStop());
  };

  const handleLanguage = (language) => {
    dispatch(changeLanguage(language));
  };

  const renderMenuItem = (entry, idx) => {
    return (
      <MenuItem key={idx} onClick={entry.func ? entry.func : showView(entry.urlFrag)}>
        <Typography variant="body1" className={classes.menuitem}>
          <FormattedMessage id={entry.id}/>
        </Typography>
      </MenuItem>
    );
  };

  let selectedTabContent;
  switch (selectedView) {
    case 'dashboard':
      selectedTabContent = <Dashboard />;
      break;
    case 'about':
      selectedTabContent = <About />;
      break;
    case 'libraries':
      selectedTabContent = <Libraries />;
      break;
    default:
      selectedTabContent = <div>Error!</div>;
  }

  const messages = translations[selectedLocale]; // get the translations for the locale


  return (
    <IntlProvider locale={selectedLocale} messages={messages}>
      <div className={classes.root}>
        <AppBar className={classes.appbar}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              edge="start"
              onClick={handleMenu}
              size="large">
              <MenuIcon />
            </IconButton>
            <Menu
              aria-label={'popover'}
              id="simple-menu"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
              transformOrigin={{vertical: 'top', horizontal: 'left'}}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuEntries.map((entry, index) =>
                renderMenuItem(entry, index))}
            </Menu>

            <Typography variant="h6" color="inherit" className={classes.grow}>
              <FormattedMessage id='title'/>
            </Typography>

            <Select value={selectedLocale}
              sx={{bgcolor: 'white'}}
              onChange={(e) => handleLanguage(e.target.value)}>
              <MenuItem value='en'>English</MenuItem>
              <MenuItem value='fr'>French</MenuItem>
            </Select>

            {/* <Link title="small area estimation Github repo"
            href=
            "https://github.com/InstituteforDiseaseModeling/SmallAreaEstimationForSurveyIndicators"
            target="_blank">
            <GitHubIcon className={classes.github}/>
          </Link> */}
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          {selectedTabContent}
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={showMsg}
            autoHideDuration={variant === 'error' ? null : 6000}
            onClose={handleSnackBarClose}
            className={classes.snackbar}
          >
            <SnackbarContentWrapper
              onClose={handleSnackBarClose}
              variant={variant}
              message={infoMsg}
            />
          </Snackbar>
        </main>
        <Footer />
      </div>
    </IntlProvider>
  );
};

Layout.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Layout);
