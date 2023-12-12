// src/components/project/PromptField.js
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

const PromptField = ({ onChange }) => {
  const [parameters, setParameters] = useState({});
  const [newPromptText, setNewPromptText] = useState(''); // Define newPromptText state

  const handleNewPromptText = (text) => {
    setNewPromptText(text);
    generateFinalPrompt(text);
  }

  const generateFinalPrompt = (text) => {
    // Replace parameters in the initial prompt with values
    let generatedPrompt = text || newPromptText;
    Object.keys(parameters).forEach((param) => {
      generatedPrompt = generatedPrompt.replace(`{${param}}`, parameters[param]);
    });

    // Call the onGenerate callback with the final prompt
    onChange(generatedPrompt);

    return generatedPrompt;
  };

  const handleParameterChange = (param, value) => {
    // Update the parameters state when input values change
    setParameters((prevParameters) => ({ ...prevParameters, [param]: value }));
  };

  const detectParameters = () => {
    // Regular expression to detect parameters in the prompt
    const paramRegex = /\{([^}]+)\}/g;

    const matches = newPromptText.match(paramRegex);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
  };

  const renderParameterTable = (paramList) => {


    if (paramList.length === 0) {
      return null;
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paramList.map((param) => (
              <TableRow key={param}>
                <TableCell>{param}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    label={param}
                    placeholder={`Enter value for ${param}`}
                    onChange={(e) => handleParameterChange(param, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const paramList = detectParameters();

  return (
    <div>
      <div>
        <TextField
          fullWidth
          multiline
          variant="outlined"
          placeholder="Enter your prompt here..."
          value={newPromptText}
          onChange={(e) => handleNewPromptText(e.target.value)}
        />
      </div>
      {renderParameterTable(paramList)}
      {paramList.length > 0 ? <div>
        <strong>Final Prompt:</strong> <pre>{generateFinalPrompt()}</pre>
      </div> : <></>}
    </div>
  );
};

export default PromptField;
