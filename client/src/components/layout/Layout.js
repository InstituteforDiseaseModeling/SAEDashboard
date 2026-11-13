/* eslint-disable max-len */
import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
  IconButton, Menu, MenuItem, Typography,
  Snackbar, Drawer, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import './gf-header.css';
import MenuIcon from '@mui/icons-material/Menu';
import Footer from './Footer';
import SettingsDialog from './SettingsDialog';
import Dashboard from '../../views/Dashboard';
import About from '../../views/About';
import Welcome from '../../views/Welcome';
import Instructions from '../../views/Instructions';
import Libraries from '../../views/Libraries';
import SnackbarContentWrapper from '../uielements/SnackBarContentWrapper';
import {showStop} from '../../redux/actions/messaging';
import PropTypes from 'prop-types';
import {changeLanguage} from '../../redux/actions/filters';
import {fetchConfigData} from '../../redux/actions/config';
import {IntlProvider, FormattedMessage} from 'react-intl';
import * as translations from '../../data/translation';
import AssistantIcon from '@mui/icons-material/Assistant';
import IndicatorManager from '../IndicatorManager';

const styles = (theme) => ({
  root: {
    marginBottom: 0,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  grow: {
    flexGrow: 1,
  },
  content: {
    display: 'block',
    marginTop: 64,
    flex: '1 0 auto',
    [theme.breakpoints.up(1500 + theme.spacing(3 * 2))]: {
      width: '100%',
      marginRight: 'auto',
    },
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
  llmButton: {
    marginLeft: theme.spacing(2),
  },
  drawer: {
    zIndex: 10000,
    overflow: 'hidden',
  },
  drawerResizer: {
    'position': 'absolute',
    'top': 0,
    'left': 0,
    'width': 6,
    'height': '100%',
    'cursor': 'col-resize',
    'zIndex': 10001,
    'backgroundColor': 'transparent',
    'transition': 'background-color 0.15s',
    '&:hover': {
      backgroundColor: 'rgba(49, 58, 68, 0.25)',
    },
  },
});

const Layout = (props) => {
  const {classes} = props;
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState(props.view);
  useEffect(() => {
    setSelectedView(props.view);
  }, [props.view]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(420);
  const resizingDrawer = useRef(false);
  const [apiKey, setApiKey] = useState('');
  const variant = useSelector((state) => state.showMsg.variant);
  const infoMsg = useSelector((state) => state.showMsg.msg);
  const showMsg = useSelector((state) => state.showMsg.open);
  const selectedLocale = useSelector((state) => state.filters.selectedLanguage);
  const configLoaded = useSelector((state) => state.config.loaded);
  const dispatch = useDispatch();
  const headerRef = useRef(null);

  const startDrawerResize = (e) => {
    e.preventDefault();
    resizingDrawer.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!resizingDrawer.current) return;
      const next = window.innerWidth - e.clientX;
      setDrawerWidth(Math.min(Math.max(next, 320), window.innerWidth * 0.9));
    };
    const onUp = () => {
      if (!resizingDrawer.current) return;
      resizingDrawer.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchConfigData());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const header = headerRef.current;
      if (!header) return;
      const y = window.scrollY;
      if (!header.classList.contains('is-condensed') && y > 40) {
        header.classList.add('is-condensed');
      } else if (header.classList.contains('is-condensed') && y < 16) {
        header.classList.remove('is-condensed');
      }
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menuEntries = [
    {urlFrag: 'welcome', id: 'dropdown_welcome'},
    {urlFrag: 'dashboard', id: 'dropdown_dashboard'},
    {urlFrag: 'about', id: 'dropdown_about'},
    {urlFrag: 'instructions', id: 'dropdown_instructions'},
    {urlFrag: 'libraries', id: 'dropdown_lib'},
    {id: 'dropdown_settings', func: () => openSettings()},
  ];

  const showView = (target) => {
    return (() => {
      setAnchorEl(null);
      setSelectedView(target);
      const path = target === 'dashboard' ? '/w/default' : `/w/default/${target}`;
      navigate(path);
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
    case 'welcome':
      selectedTabContent = <Welcome />;
      break;
    case 'dashboard':
      selectedTabContent = configLoaded ? <Dashboard /> : (
        <div style={{textAlign: 'center', marginTop: 80}}>Loading...</div>
      );
      break;
    case 'about':
      selectedTabContent = <About />;
      break;
    case 'libraries':
      selectedTabContent = <Libraries />;
      break;
    case 'instructions':
      selectedTabContent = <Instructions />;
      break;
    default:
      selectedTabContent = <div>Error!</div>;
  }

  const toggleDrawer = () => setDrawerOpen((v) => !v);
  const closeDrawer = () => setDrawerOpen(false);

  const openSettings = () => {
    setAnchorEl(null);
    setSettingsOpen(true);
  };

  const closeSettings = () => setSettingsOpen(false);

  const refreshDashboardIndicators = () => {
    window.location.reload();
  };

  const messages = translations[selectedLocale];

  const drawerOffset = {
    marginRight: drawerOpen ? drawerWidth : 0,
    transition: resizingDrawer.current ? 'none' : 'margin-right 225ms cubic-bezier(0, 0, 0.2, 1)',
  };

  return (
    <IntlProvider locale={selectedLocale} messages={messages}>
      <div className={classes.root}>
        <header className="gf-header" ref={headerRef}>
          <IconButton
            className="gf-menu-btn"
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
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            transformOrigin={{vertical: 'top', horizontal: 'left'}}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {menuEntries.map((entry, index) =>
              renderMenuItem(entry, index))}
          </Menu>

          <div className="gf-brand">
            <span className="gf-title">
              <FormattedMessage id='title'/>
            </span>
          </div>

          <div className="gf-controls">
            <ToggleButtonGroup
              value={selectedLocale}
              exclusive
              size="small"
              onChange={(_e, value) => value !== null && handleLanguage(value)}
              sx={{
                'height': 36,
                '& .MuiToggleButton-root': {
                  fontFamily: '"Noto Sans", system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '4px 14px',
                  color: '#313A44',
                  border: '1px solid #E7E9EB',
                  borderRadius: '2px',
                  transition: 'all 140ms ease',
                },
                '& .MuiToggleButton-root:hover': {
                  backgroundColor: 'rgba(49, 58, 68, 0.06)',
                  borderColor: '#838890',
                },
                '& .MuiToggleButton-root.Mui-selected': {
                  backgroundColor: '#EBCB00',
                  color: '#313A44',
                  borderColor: '#EBCB00',
                },
                '& .MuiToggleButton-root.Mui-selected:hover': {
                  backgroundColor: '#D2B500',
                  color: '#313A44',
                },
              }}
            >
              <ToggleButton value="en" aria-label="English">EN</ToggleButton>
              <ToggleButton value="fr" aria-label="Francais">FR</ToggleButton>
            </ToggleButtonGroup>

            <IconButton aria-label="indicators" size="medium" onClick={toggleDrawer}
              title="AI assistant"
              className="gf-assistant-btn">
              <AssistantIcon fontSize="medium"/>
            </IconButton>
          </div>
        </header>
        <main className={classes.content} style={drawerOffset}>
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
          <Drawer open={drawerOpen} anchor="right" variant="persistent"
            classes={{
              paper: classes.drawer,
            }}
            PaperProps={{style: {width: drawerWidth}}}
          >
            <div
              onMouseDown={startDrawerResize}
              className={classes.drawerResizer}
            />
            <IndicatorManager closeDrawer={closeDrawer} onIndicatorAdded={refreshDashboardIndicators} apiKey={apiKey} onApiKeyChange={setApiKey} drawerWidth={drawerWidth}/>
          </Drawer>
          <SettingsDialog open={settingsOpen} onClose={closeSettings} />
        </main>
        <div style={drawerOffset}>
          <Footer />
        </div>
      </div>
    </IntlProvider>
  );
};

Layout.propTypes = {
  classes: PropTypes.object,
  view: PropTypes.string,
};

export default withStyles(styles)(Layout);
