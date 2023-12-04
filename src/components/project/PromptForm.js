// src/components/project/PromptForm.js
import React, { useState } from 'react';
import { Button, TextareaAutosize, TextField } from '@mui/material';
import { FormContainer, Label, Textarea, SubmitButton } from './PromptForm.styles';

const PromptForm = ({ onCreatePrompt }) => {
  const [promptText, setPromptText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePrompt(promptText);
    setPromptText('');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>
        <span>Prompt Text:</span>
        <Textarea
          rowsMin={3}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
      </Label>
      <SubmitButton type="submit">
        Create Prompt
      </SubmitButton>
    </FormContainer>
  );
};

export default PromptForm;
