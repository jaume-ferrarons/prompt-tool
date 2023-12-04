// src/components/project/PromptForm.js
import React, { useState } from 'react';

const PromptForm = ({ onCreatePrompt }) => {
  const [promptText, setPromptText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePrompt(promptText);
    setPromptText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Prompt Text:
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
      </label>
      <button type="submit">Create Prompt</button>
    </form>
  );
};

export default PromptForm;
