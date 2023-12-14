import React, { useState } from 'react';
import { TextField } from '@mui/material';

const PromptInputText = ({onChange, onParametersChange}) => {
    const [prompt, setPrompt] = useState("");
    const [parameters, setParameters] = useState([]);

    const handlePromptChange = (prompt) => {
        setPrompt(prompt);
        onChange(prompt);
        const paramRegex = /\{([^}]+)\}/g;
        const matches = prompt.match(paramRegex);
        const newParams = matches ? matches.map((match) => match.slice(1, -1)) : [];
        if (JSON.stringify(parameters) !== JSON.stringify(newParams)) {
            onParametersChange(newParams);
            setParameters(newParams);
        }
    }

    return <TextField
        fullWidth
        multiline
        variant="outlined"
        placeholder="Enter your prompt here..."
        label="Prompt"
        value={prompt}
        onChange={(e) => handlePromptChange(e.target.value)}
    />
}

export default PromptInputText;