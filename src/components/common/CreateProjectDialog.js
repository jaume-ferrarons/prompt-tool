// src/components/common/CreateProjectDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const CreateProjectDialog = ({ open, onClose, onCreateProject, existingProjectNames }) => {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  const handleCreateProject = async () => {
    // Check if the project name is not empty
    const trimmedName = projectName.trim();
    if (trimmedName === '') {
      setError('Project name cannot be empty.');
      return;
    }

    // Check if a project with the same name already exists
    if (existingProjectNames.includes(trimmedName)) {
      setError('A project with the same name already exists.');
      return;
    }

    // Reset the error
    setError('');

    // Create the project
    onCreateProject({ name: trimmedName });

    // Reset the project name field
    setProjectName('');

    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a New Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a new project name:
        </DialogContentText>
        <TextField
          fullWidth
          margin="dense"
          label="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateProject} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectDialog;
