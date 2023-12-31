// src/components/common/ApiKeyDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material';

const ApiKeyDialog = ({ open, onClose, onSave }) => {
  const [cohereApiKey, setCohereApiKey] = useState(localStorage.getItem('cohereApiKey') || '');
  const [hfInferenceApiKey, sethfInferenceApiKey] = useState(localStorage.getItem('hfInferenceApiKey') || '');
  const [openaiApiKey, setOpenAIApiKey] = useState(localStorage.getItem('openaiApiKey') || '');
  const [showKeys, setShowKeys] = useState(false);

  const handleSave = () => {
    onSave(cohereApiKey, hfInferenceApiKey, openaiApiKey);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>API Keys</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Switch checked={showKeys} onChange={() => setShowKeys(!showKeys)} />}
          label="Show Keys"
        />
        <DialogContentText>
          Enter your API keys to be used:
        </DialogContentText>
        Cohere API Key:
        <TextField
          autoFocus
          margin="dense"
          label="Cohere API Key"
          type={showKeys ? 'text' : 'password'}
          fullWidth
          value={cohereApiKey}
          onChange={(e) => setCohereApiKey(e.target.value)}
        />
        Huggingface API Key:
        <TextField
          margin="dense"
          label="Huggingface API Key"
          type={showKeys ? 'text' : 'password'}
          fullWidth
          value={hfInferenceApiKey}
          onChange={(e) => sethfInferenceApiKey(e.target.value)}
        />
        OpenAI API Key:
        <TextField
          margin="dense"
          label="OpenAI API Key"
          type={showKeys ? 'text' : 'password'}
          fullWidth
          value={openaiApiKey}
          onChange={(e) => setOpenAIApiKey(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyDialog;
