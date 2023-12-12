import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const CohereModelParams = ({ onChange }) => {
  const [model, setModel] = useState('command');
  const [preambleOverride, setPreambleOverride] = useState('');
  const [temperature, setTemperature] = useState('0.3'); // Use string for text field input
  const [promptTruncation, setPromptTruncation] = useState('AUTO');

  const reportParameters = () => {
    onChange({
      model: model,
      preamble_override: preambleOverride, 
      temperature: temperature, 
      prompt_truncation: promptTruncation
    })
  }

  useEffect(reportParameters, [model, preambleOverride, temperature, promptTruncation, onChange]);

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handlePreambleOverrideChange = (e) => {
    setPreambleOverride(e.target.value);
  };

  const handleTemperatureChange = (e) => {
    const value = e.target.value;
    // Ensure the value is within the valid range (0 to 5)
    if (/^[0-5](\.\d+)?$/.test(value) || value === '') {
      setTemperature(parseFloat(value));
    }
  };

  const handlePromptTruncationChange = (e) => {
    setPromptTruncation(e.target.value);
  };

  return (
    <>
      <FormControl sx={{ margin: 1 }}>
        <InputLabel htmlFor="model">Version</InputLabel>
        <Select
          id="model"
          label="Version"
          value={model}
          onChange={handleModelChange}
          size='small'
        >
          <MenuItem value="command">command</MenuItem>
          <MenuItem value="command-light">command-light</MenuItem>
          <MenuItem value="command-nightly">command-nightly</MenuItem>
          <MenuItem value="command-light-nightly">command-light-nightly</MenuItem>
        </Select>
      </FormControl>


      <TextField
        id="temperature"
        type="number"
        size="small"
        label="Temperature"
        inputProps={{ min: 0, max: 5, step: 0.1 }}
        InputLabelProps={{
          shrink: true,
        }}
        value={temperature}
        onChange={handleTemperatureChange}
        sx={{ margin: 1 }}
      />

      <FormControl sx={{ margin: 1 }}>
        <InputLabel htmlFor="prompt-truncation">Truncation</InputLabel>
        <Select
          size="small"
          id="prompt-truncation"
          value={promptTruncation}
          label="Truncation"
          onChange={handlePromptTruncationChange}
        >
          <MenuItem value="OFF">OFF</MenuItem>
          <MenuItem value="AUTO">AUTO</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        size='small'
        label="Preamble Override"
        value={preambleOverride}
        onChange={handlePreambleOverrideChange}
        sx={{ margin: 1 }}
      />

    </>
  );
};

export default CohereModelParams;
