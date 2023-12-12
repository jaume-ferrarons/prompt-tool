import React, { useState, useEffect } from 'react';
import { TextField, FormControlLabel, Checkbox } from '@mui/material';

function removeInvalid(parameters) {
  const result = {};
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== "") {
      result[key] = value;
    }
  }
  return result;
}

const HFTextGenParams = ({ onChange }) => {
  const [topK, setTopK] = useState('');
  const [topP, setTopP] = useState('');
  const [temperature, setTemperature] = useState(1.0); // Default: 1.0
  const [repetitionPenalty, setRepetitionPenalty] = useState('');
  const [maxNewTokens, setMaxNewTokens] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [returnFullText, setReturnFullText] = useState(true);
  const [numReturnSequences, setNumReturnSequences] = useState(1); // Default: 1
  const [doSample, setDoSample] = useState(true);

  const reportParameters = () => {
    onChange(removeInvalid({
      top_k: topK,
      top_p: topP,
      temperature,
      repetition_penalty: repetitionPenalty,
      max_new_tokens: maxNewTokens,
      max_time: maxTime,
      return_full_text: returnFullText,
      num_return_sequences: numReturnSequences,
      do_sample: doSample,
    }));
  }

  useEffect(reportParameters, [topK, topP, temperature, repetitionPenalty, maxNewTokens, maxTime, returnFullText, numReturnSequences, doSample, onChange]);

  const handleNumber = (n) => {
    return n === '' ? '' : Number(n);
  }

  return (
    <>
      <TextField
        type="number"
        size="small"
        label="Top K"
        onChange={(e) => setTopK(handleNumber(e.target.value))}
        value={topK}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Top P"
        size="small"
        value={topP}
        onChange={(e) => setTopP(handleNumber(e.target.value))}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Temperature"
        size="small"
        inputProps={{ min: 0, max: 100, step: 0.1 }}
        value={temperature}
        onChange={(e) => setTemperature(handleNumber(e.target.value))}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Repetition Penalty"
        size="small"
        value={repetitionPenalty}
        onChange={(e) => setRepetitionPenalty(handleNumber(e.target.value))}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Max New Tokens"
        size="small"
        value={maxNewTokens}
        onChange={(e) => setMaxNewTokens(handleNumber(e.target.value))}
        sx={{ margin: 1 }}
      />

      <TextField
        type="number"
        label="Max Time"
        size="small"
        inputProps={{ min: 0, max: 120, step: 0.1 }}
        value={maxTime}
        onChange={(e) => setMaxTime(handleNumber(e.target.value))}
        sx={{ margin: 1 }}
      />


      <FormControlLabel control={
        <Checkbox
          checked={returnFullText}
          onChange={(e) => setReturnFullText(e.target.checked)}
          sx={{ margin: 1 }}
        />
      } label="returnFullText" />

      <TextField
        type="number"
        label="Num Return Sequences"
        size="small"
        value={numReturnSequences}
        onChange={(e) => setNumReturnSequences(handleNumber(e.target.value))}
        sx={{ margin: 1 }}
      />


      <FormControlLabel control={
        <Checkbox
          checked={doSample}
          onChange={(e) => setDoSample(e.target.checked)}
          sx={{ margin: 1 }}
        />
      } label="doSample" />
    </>
  );
};

export default HFTextGenParams;
