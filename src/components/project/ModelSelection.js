// src/components/project/ModelSelection.js
import React from 'react';
import { Select, MenuItem, CircularProgress } from '@mui/material';

const ModelSelection = ({ models, selectedModel, onSelectModel }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Select value={selectedModel} onChange={(e) => onSelectModel(e.target.value)}>
        {models.map((model) => (
          <MenuItem key={model.name} value={model.name}>
            {model.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default ModelSelection;
