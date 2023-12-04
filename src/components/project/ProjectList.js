// src/components/project/ProjectList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectList = ({ projects }) => {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
