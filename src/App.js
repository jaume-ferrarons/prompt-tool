// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProjectDetails from './components/project/ProjectDetails';
import { getProjectById } from './utils/indexedDB';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes basename='/prompt-tool'>
          <Route path="/" exact element={
            <Layout>
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
