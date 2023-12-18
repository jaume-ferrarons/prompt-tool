// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProjectDetails from './components/project/ProjectDetails';
import { getProjectById } from './utils/indexedDB';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lime, grey } from '@mui/material/colors';
import ReactGA from "react-ga4";
import GettingStarted from './components/landing/GettingStarted';

ReactGA.initialize("G-B8TSRE6890");

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: lime,
    secondary: grey,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes basename='/prompt-tool'>
          <Route path="/" exact element={
            <Layout>
              <GettingStarted/>
            </Layout>
          }>
          </Route>
          <Route path="/projects/:projectId" element={
            <Layout>
              <ProjectDetails getProjectById={getProjectById} />
            </Layout>
          }>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
