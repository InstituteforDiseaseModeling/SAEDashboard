import React from 'react';
import configureStore from './redux/store';
import Provider from 'react-redux/es/components/Provider';
import {createTheme, CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material';
import blue from '@mui/material/colors/blue';
import Layout from './components/layout/Layout';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import './App.css';

import * as am4core from '@amcharts/amcharts4/core';


if (process.env.REACT_APP_MAP_LICENSE) {
  am4core.addLicense(process.env.REACT_APP_MAP_LICENSE);
}
if (process.env.REACT_APP_CHART_LICENSE) {
  am4core.addLicense(process.env.REACT_APP_CHART_LICENSE);
}

// Set the theme for am4 charts
// Disable animations for now
// am4core.useTheme(am4themes_animated);

const theme = createTheme({
  palette: {
    primary: blue,
  },
  typography: {
    'fontFamily': '"Roboto condensed", "Roboto", sans-serif',
  },
  components: {

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white!important',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: 'white!important',
        },
      },
    },
  },

});


// Create the redux store
const store = configureStore();

/**
 * App component
 * @return {React.ReactElement}
 */
function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout view='welcome'/>}/>
              <Route path="dashboard" element={<Layout view='dashboard'/>}/>
              <Route path="about" element={<Layout view='about'/>}/>
              <Route path="welcome" element={<Layout view='welcome'/>}/>
              <Route path="libraries" element={<Layout view='libraries'/>}/>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

export default App;
