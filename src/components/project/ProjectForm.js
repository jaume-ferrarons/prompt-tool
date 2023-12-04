// src/components/project/ProjectForm.js
import React, { useState } from 'react';

const ProjectForm = ({ onCreateProject }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProject({ name: projectName });
    setProjectName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Project Name:
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </label>
      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectForm;
