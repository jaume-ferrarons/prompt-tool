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
  const [openchatApiKey, setOpenchatApiKey] = useState(localStorage.getItem('openchatApiKey') || '');
  const [showKeys, setShowKeys] = useState(false);

  const handleSave = () => {
    onSave(cohereApiKey, openchatApiKey);
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
          Enter your API keys for Cohere and OpenChat.
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
          value={openchatApiKey}
          onChange={(e) => setOpenchatApiKey(e.target.value)}
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
