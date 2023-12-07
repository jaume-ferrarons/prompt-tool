// src/components/project/ProjectList.js
import React from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';
import { ListContainer } from './ProjectList.styles';
import { Link } from "react-router-dom";

const ProjectList = ({ projects }) => {
  return (
    <ListContainer>
      {projects.map((project) => (
        <ListItem key={project.id}>
          <Link to={`/projects/${project.id}`}>
            <ListItemText>
              <Typography variant="h6">{project.name}</Typography>
            </ListItemText>
          </Link>
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default ProjectList;
