// src/components/project/ModelSelection.js
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ModelSelection = ({ models, selectedModel, onSelectModel }) => {
  return (
      <FormControl fullWidth>
      <InputLabel id="select-model-label">Model</InputLabel>
        <Select labelId="select-model-label" label="Model" value={selectedModel} onChange={(e) => onSelectModel(e.target.value)}>
          {models.map((model) => (
            <MenuItem key={model.name} value={model.name}>
              {model.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
};

export default ModelSelection;
