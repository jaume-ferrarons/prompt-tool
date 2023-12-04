// src/components/project/ProjectList.styles.js
import { styled } from '@mui/system';

const ListContainer = styled('ul')({
  listStyle: 'none',
  padding: 0,
});

const ListItem = styled('li')({
  marginBottom: '8px',
  border: '1px solid #ddd',
  padding: '8px',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ListItemLink = styled('a')({
  textDecoration: 'none',
  color: 'inherit',
});

export { ListContainer, ListItem, ListItemLink };
