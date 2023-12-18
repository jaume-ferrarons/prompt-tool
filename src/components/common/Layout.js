// src/components/common/Layout.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Select, MenuItem, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProjects, addProject } from '../../utils/indexedDB';
import ApiKeyDialog from './ApiKeyDialog';
import CreateProjectDialog from './CreateProjectDialog';
import PageTracking from './PageTracking';

const Layout = ({ children }) => {
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [openApiKeyDialog, setOpenApiKeyDialog] = useState(false);
  const [openCreateProjectDialog, setOpenCreateProjectDialog] = useState(false);
  const [existingProjectNames, setExistingProjectNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsFromDB = await getAllProjects();
        const projectNames = projectsFromDB.map((project) => project.name);
        setProjects(projectsFromDB);
        setExistingProjectNames(projectNames);

        setSelectedProject(projectId || '');
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      }
    };

    fetchProjects();
  }, [projectId]);

  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    if (projectId !== null) {
      setSelectedProject(projectId);

      // Update the URL
      navigate(`/projects/${projectId}`);
    }
  };

  const handleApiKeyDialogOpen = () => {
    setOpenApiKeyDialog(true);
  };

  const handleApiKeyDialogClose = () => {
    setOpenApiKeyDialog(false);
  };

  const handleSaveApiKeys = (cohereApiKey, openchatApiKey) => {
    // Save API keys to localStorage
    localStorage.setItem('cohereApiKey', cohereApiKey);
    localStorage.setItem('openchatApiKey', openchatApiKey);

    // Close the dialog
    setOpenApiKeyDialog(false);
  };

  const handleCreateProjectDialogOpen = () => {
    setOpenCreateProjectDialog(true);
  };

  const handleCreateProjectDialogClose = () => {
    setOpenCreateProjectDialog(false);
  };

  const handleCreateProject = async (projectData) => {
    try {
      const projectId = await addProject(projectData);
      const newProject = { id: projectId, ...projectData };
      setProjects([...projects, newProject]);
      setExistingProjectNames([...existingProjectNames, projectData.name]);

      navigate(`/projects/${projectId}`);

    } catch (error) {
      console.error('Error creating project:', error.message);
    } finally {
      setOpenCreateProjectDialog(false);
    }
  };

  return (
    <div>
      <PageTracking/>
      <AppBar position="static">
        <Toolbar>
          <Select
            value={selectedProject}
            onChange={handleProjectChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{
              color: 'white',
              '& .MuiSelect-icon': {
                color: 'white',
              },
            }}
          >
            {projectId === undefined && (
              <MenuItem value="" disabled>
                Select a project
              </MenuItem>
            )}
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
            <MenuItem value={null} onClick={handleCreateProjectDialogOpen}>
              Create new project
            </MenuItem>
          </Select>
          <Button color="primary" onClick={handleApiKeyDialogOpen}>
            API Keys
          </Button>
        </Toolbar>
      </AppBar>

      <ApiKeyDialog
        open={openApiKeyDialog}
        onClose={handleApiKeyDialogClose}
        onSave={handleSaveApiKeys}
      />

      <CreateProjectDialog
        open={openCreateProjectDialog}
        onClose={handleCreateProjectDialogClose}
        onCreateProject={handleCreateProject}
        existingProjectNames={existingProjectNames}
      />

      {children}
    </div>
  );
};

export default Layout;
