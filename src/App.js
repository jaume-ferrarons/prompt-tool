// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProjectList from './components/project/ProjectList';
import ProjectForm from './components/project/ProjectForm';
import ProjectDetails from './components/project/ProjectDetails';
import PromptForm from './components/project/PromptForm';
import { addProject, getAllProjects, getProjectById } from './utils/indexedDB';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const projectsFromDB = await getAllProjects();
    setProjects(projectsFromDB);
  };

  const handleCreateProject = async (projectData) => {
    const projectId = await addProject(projectData);
    const newProject = { id: projectId, ...projectData };
    setProjects([...projects, newProject]);
  };

  const handleSelectProject = (projectId) => {
    // Implement navigation or route to project details page
    console.log(`Selected project: ${projectId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" exact element={
              <>
                <ProjectList projects={projects} />
                <ProjectForm onCreateProject={handleCreateProject} />
              </>
            }>
            </Route>
            <Route path="/projects/:projectId" element={
              <ProjectDetails getProjectById={getProjectById} />
            }>
            </Route>
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
