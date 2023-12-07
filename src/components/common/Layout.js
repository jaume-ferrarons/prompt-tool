// src/components/common/Layout.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../../utils/indexedDB'; // Adjust the path as needed
import ApiKeyDialog from './ApiKeyDialog';

const Layout = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [openApiKeyDialog, setOpenApiKeyDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsFromDB = await getAllProjects();
        setProjects(projectsFromDB);
        setSelectedProject(projectsFromDB.length > 0 ? projectsFromDB[0].id : '');

      } catch (error) {
        console.error('Error fetching projects:', error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    setSelectedProject(projectId);

    // Update the URL
    navigate(`/prompt-tool/projects/${projectId}`);
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

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {/* Your logo can be placed here */}
          <Select
            value={selectedProject}
            onChange={handleProjectChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{
              fontSize: '1.2rem', // Adjust the font size as needed
              color: 'white',    // Text color
              '& .MuiSelect-icon': {
                color: 'white',   // Arrow color
              },
            }}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>

          <Button color="inherit" onClick={handleApiKeyDialogOpen}>
            API Keys
          </Button>
        </Toolbar>
      </AppBar>

      <ApiKeyDialog
        open={openApiKeyDialog}
        onClose={handleApiKeyDialogClose}
        onSave={handleSaveApiKeys}
      />

      {children}
    </div>
  );
};

export default Layout;
