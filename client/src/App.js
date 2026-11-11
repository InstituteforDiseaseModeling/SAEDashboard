import React from 'react';
import configureStore from './redux/store';
import Provider from 'react-redux/es/components/Provider';
import {createTheme, CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material';
import Layout from './components/layout/Layout';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import {GF} from './gf-colors';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: GF.slate,
      dark: GF.slateDark,
      light: GF.slate80,
      contrastText: GF.parchment,
    },
    secondary: {
      main: GF.saffron,
      dark: GF.saffronDark,
      light: GF.yellowLight,
      contrastText: GF.slate,
    },
    background: {
      default: GF.parchment,
      paper: GF.white,
    },
    text: {
      primary: GF.slate,
      secondary: GF.slate80,
    },
    divider: GF.parchmentDark,
    success: {main: '#3AC9B1'},
    warning: {main: '#D93027'},
    info: {main: '#248AF9'},
  },
  shape: {
    borderRadius: 2,
  },
  typography: {
    'fontFamily': '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif',
    'fontWeightLight': 300,
    'fontWeightRegular': 300,
    'fontWeightMedium': 800,
    'fontWeightBold': 800,
    'h1': {fontFamily: '"Noto Serif", Georgia, serif'},
    'h2': {fontFamily: '"Noto Serif", Georgia, serif'},
    'h3': {fontFamily: '"Noto Serif", Georgia, serif'},
    'h4': {fontFamily: '"Noto Serif", Georgia, serif'},
    'h5': {fontFamily: '"Noto Serif", Georgia, serif'},
    'h6': {fontFamily: '"Noto Serif", Georgia, serif'},
    'button': {textTransform: 'none', fontWeight: 800, letterSpacing: '0.02em'},
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: GF.slate80,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: GF.slate80,
        },
      },
    },
  },
});

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/w/default" replace />}/>
              <Route path="/w/default" element={<Layout view='dashboard'/>}/>
              <Route path="/w/default/welcome" element={<Layout view='welcome'/>}/>
              <Route path="/w/default/about" element={<Layout view='about'/>}/>
              <Route path="/w/default/instructions" element={<Layout view='instructions'/>}/>
              <Route path="/w/default/libraries" element={<Layout view='libraries'/>}/>
              <Route path="dashboard" element={<Layout view='dashboard'/>}/>
              <Route path="about" element={<Layout view='about'/>}/>
              <Route path="instructions" element={<Layout view='instructions'/>}/>
              <Route path="libraries" element={<Layout view='libraries'/>}/>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

export default App;
