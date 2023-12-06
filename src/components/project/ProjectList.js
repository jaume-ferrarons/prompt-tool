// src/components/project/ProjectList.js
import React from 'react';
import { ListItem, ListItemText, Typography, Link } from '@mui/material';
import { ListContainer, ListItemLink } from './ProjectList.styles';

const ProjectList = ({ projects }) => {
  return (
    <ListContainer>
      {projects.map((project) => (
        <ListItem key={project.id}>
          <ListItemLink component={Link} href={`/projects/${project.id}`}>
            <ListItemText>
              <Typography variant="h6">{project.name}</Typography>
            </ListItemText>
          </ListItemLink>
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default ProjectList;
