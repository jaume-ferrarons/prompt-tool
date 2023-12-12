// src/components/project/ModelSelection.js
import React, { useState, useEffect } from 'react';
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
import CohereModelParams from '../model/CohereModelParams';
import {models} from '../../services/modelRegistry';
import HFTextGenParams from '../model/HFTextGenParams';

const ModelSelection = ({ onSelectModel }) => {
  const [enableCustomParams, setEnableCustomParams] = useState(false);
  const [modelParameters, setModelParameters] = useState({});
  const [modelName, setModelName] = useState('cohere');

  const handleModelChange = () => {
    var parameters = {};
    if (enableCustomParams) {
      parameters = modelParameters;
    }
    onSelectModel({
      "model": modelName,
      parameters
    })
  }

  useEffect(handleModelChange, [modelName, enableCustomParams, modelParameters, onSelectModel])

  const handleCustomParametersSwitch = () => {
    setEnableCustomParams(!enableCustomParams);
    setModelParameters({});
  }

  const handleModelNameChange = (name) => {
    setModelName(name);
    setEnableCustomParams(false);
    setModelParameters({});
  }

  return <>
    <Grid sx={{ "margin": 1 }} alignItems="center" container spacing={1}>
      <Grid item>
        <FormControl sx={{ "margin": 1 }}>
          <InputLabel id="select-model-label">Model</InputLabel>
          <Select labelId="select-model-label"
            size="small" label="Model"
            value={modelName}
            onChange={(e) => handleModelNameChange(e.target.value)}>
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
      <Grid component={Paper} sx={{ "margin": 1, "padding": 1 }} xl={12}>
        {modelName === "cohere" && <CohereModelParams onChange={setModelParameters} />}
        {modelName === "openchat" && <HFTextGenParams onChange={setModelParameters}/>}
      </Grid>
    </Collapse>
  </>;
};

export default ModelSelection;
