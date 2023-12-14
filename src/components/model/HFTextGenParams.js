import React, { useCallback } from 'react';
import { TextField, FormControlLabel, Checkbox } from '@mui/material';

const HFTextGenParams = ({ parameters, onChange }) => {
  const reportParameters = useCallback((parameter) => (event) => {
    var value;
    if ([
      "return_full_text",
      "do_sample"
    ].includes(parameter)) {
      value = event.target.checked;
    } else {
      value = parseFloat(event.target.value);
    }
    
    onChange({
      ...parameters,
      [parameter]: value
    });
  }, [parameters, onChange]);

  return (
    <>
      <TextField
        type="number"
        size="small"
        label="Top K"
        onChange={reportParameters("top_k")}
        value={parameters["top_k"]}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Top P"
        size="small"
        value={parameters["top_p"]}
        onChange={reportParameters("top_p")}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Temperature"
        size="small"
        inputProps={{ min: 0, max: 100, step: 0.1 }}
        value={parameters["temperature"]}
        onChange={reportParameters("temperature")}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Repetition Penalty"
        size="small"
        value={parameters["repetition_penalty"]}
        onChange={reportParameters("repetition_penalty")}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Max New Tokens"
        size="small"
        value={parameters["max_new_tokens"]}
        onChange={reportParameters("max_new_tokens")}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Max Time"
        size="small"
        inputProps={{ min: 0, max: 120, step: 0.1 }}
        value={parameters["max_time"]}
        onChange={reportParameters("max_time")}
        sx={{ margin: 1 }}
      />


      <FormControlLabel control={
        <Checkbox
          checked={parameters["return_full_text"]}
          onChange={reportParameters("return_full_text")}
          sx={{ margin: 1 }}
        />
      } label="returnFullText" />

      <TextField
        type="number"
        label="Num Return Sequences"
        size="small"
        value={parameters["num_return_sequences"]}
        onChange={reportParameters("num_return_sequences")}
        sx={{ margin: 1 }}
      />


      <FormControlLabel control={
        <Checkbox
          checked={parameters["do_sample"]}
          onChange={reportParameters("do_sample")}
          sx={{ margin: 1 }}
        />
      } label="doSample" />
    </>
  );
};

export default HFTextGenParams;
