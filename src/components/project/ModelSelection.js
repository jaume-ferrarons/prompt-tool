// src/components/project/ModelSelection.js
import React, { useState, useCallback, useRef } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  FormControlLabel,
  Switch,
  Paper,
  Collapse
} from '@mui/material';
import { models } from '../../services/modelRegistry';
import ModelParams from '../model/ModelParams';

const ModelSelection = ({ model, onSelectModel }) => {
  const [enableCustomParams, setEnableCustomParams] = useState(Object.keys(model.parameters).length > 0);

  const stateRef = useRef();
  stateRef.modelParameters = {  // Defaults
    "cohere": {
      "model": "command",
      "temperature": "0.3",
      "prompt_truncation": "AUTO",
      "preamble_override": "",
    },
    "openchat": {
      "top_k": '',
      "top_p": '',
      "temperature": 1.0,
      "repetition_penalty": '',
      "max_new_tokens": '',
      "max_time": '',
      "return_full_text": false,
      "num_return_sequences": '',
      "do_sample": true,
    },
    "openai": {
      "model": "gpt-3.5-turbo",
      "temperature": 1.0,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "hfInferenceAPI": {
      "model": "mistralai/Mistral-7B-v0.1",
    },
    "hfInferenceAPIText2Image": {
      "model": "dataautogpt3/OpenDalle",
    }
  };

  const handleCustomParametersSwitch = useCallback(() => {
    let parameters = {}
    if (!enableCustomParams) {
      parameters = stateRef.modelParameters[model["model"]];
    }
    setEnableCustomParams(!enableCustomParams);
    onSelectModel({
      ...model,
      parameters
    })
  }, [model, onSelectModel, enableCustomParams]);

  const handleModelNameChange = useCallback((event) => {
    const modelName = event.target.value;
    setEnableCustomParams(false);
    onSelectModel({
      model: modelName,
      parameters: {}
    })
  }, [onSelectModel]);

  const handleSetModelParameters = useCallback((model) => (parameters) => {
    stateRef.modelParameters = { ...stateRef.modelParameters, [model]: parameters };
    onSelectModel({
      model: model,
      parameters: parameters
    });
  }, [onSelectModel]);

  return <>
    <Grid sx={{ "padding": 1 }} alignItems="center" container spacing={1}>
      <Grid item>
        <FormControl sx={{ "marginLeft": 1 }}>
          <InputLabel id="select-model-label">Model</InputLabel>
          <Select labelId="select-model-label"
            size="small" label="Model"
            value={model["model"]}
            onChange={handleModelNameChange}>
            {Object.keys(models).map((model) => (
              <MenuItem key={model} value={model}>
                {models[model].displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControlLabel control={<Switch
          checked={enableCustomParams}
          onChange={handleCustomParametersSwitch}
        />} label="Custom parameters" />
      </Grid>
    </Grid>
    <Collapse in={enableCustomParams}>
      <Grid sx={{ "marginLeft": 1 }} xl={12}>
        <ModelParams values={model["parameters"]}
          parametersConfig={models[model.model].parameters}
          onChange={handleSetModelParameters(model.model)} />
      </Grid>
    </Collapse>
  </>;
};

export default ModelSelection;
