import React, { useRef, useCallback } from 'react';
import { TextField } from '@mui/material';

const PromptInputText = ({prompt, onChange, onParametersChange}) => {
    const parameters = useRef([])

    const handlePromptChange = useCallback((event) => {
        const prompt = event.target.value;
        onChange(prompt);
        const paramRegex = /\{([^}]+)\}/g;
        const matches = prompt.match(paramRegex);
        const newParams = matches ? matches.map((match) => match.slice(1, -1)) : [];
        if (JSON.stringify(parameters.current) !== JSON.stringify(newParams)) {
            onParametersChange(newParams);
            parameters.current = newParams;
        }
    }, [onChange, onParametersChange]);

    return <TextField
        fullWidth
        multiline
        variant="outlined"
        placeholder="Enter your prompt here..."
        label="Prompt"
        value={prompt}
        onChange={handlePromptChange}
        sx={{"margin": 2}}
    />
}

export default PromptInputText;