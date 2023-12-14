import React, { useCallback } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const CohereModelParams = ({ parameters, onChange }) => {
  const reportParameters = useCallback((parameter) => (event) => {
    var value = event.target.value;
    if (parameter === "temperature") value = parseFloat(value);
    onChange({
      ...parameters,
      [parameter]: value
    });
  }, [parameters, onChange]);

  return (
    <>
      <FormControl sx={{ margin: 1 }}>
        <InputLabel htmlFor="model">Version</InputLabel>
        <Select
          id="model"
          label="Version"
          value={parameters["model"] || 'command'}
          onChange={reportParameters("model")}
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
        value={parameters["temperature"] || '0.3'}
        onChange={reportParameters("temperature")}
        sx={{ margin: 1 }}
      />

      <FormControl sx={{ margin: 1 }}>
        <InputLabel htmlFor="prompt-truncation">Truncation</InputLabel>
        <Select
          size="small"
          id="prompt-truncation"
          value={parameters["prompt_truncation"] || 'AUTO'}
          label="Truncation"
          onChange={reportParameters("prompt_truncation")}
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
        value={parameters["preamble_override"] || ''}
        onChange={reportParameters("preamble_override")}
        sx={{ margin: 1 }}
      />

    </>
  );
};

export default CohereModelParams;
