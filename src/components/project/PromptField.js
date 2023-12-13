import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const PromptField = ({ onChange }) => {
  const [examples, setExamples] = useState([{ parameters: {}, text: '' }]);
  const [newPromptText, setNewPromptText] = useState('');
  const [finalPrompts, setFinalPrompts] = useState([]);
  const [parameters, setParameters] = useState([]);

  const generateFinalPrompts = () => {
    let finalPrompts = examples.map((example) => {
      let generatedPrompt = newPromptText;

      if (generatedPrompt) {
        Object.keys(example.parameters).forEach((param) => {
          generatedPrompt = generatedPrompt.replace(`{${param}}`, example.parameters[param]);
        });
      }
      return generatedPrompt;
    });
    if (finalPrompts.length === 0) {
      finalPrompts = [newPromptText]
    }
    onChange(finalPrompts);
    setFinalPrompts(finalPrompts);
  };

  useEffect(generateFinalPrompts, [examples, newPromptText, onChange]);

  useEffect(() => {
    const paramRegex = /\{([^}]+)\}/g;
    const matches = newPromptText.match(paramRegex);
    const newParams = matches ? matches.map((match) => match.slice(1, -1)) : [];
    setParameters(newParams);
  }, [newPromptText]);

  const handleParameterChange = (param, value, index) => {
    setExamples((prevExamples) =>
      prevExamples.map((example, current_index) =>
        current_index === index ? { ...example, parameters: { ...example.parameters, [param]: value } } : example
      )
    );
  };

  const handleAddExample = () => {
    setExamples((prevExamples) => [
      ...prevExamples,
      { parameters: {}, text: '' },
    ]);
  };

  const handleRemoveExample = (exampleIndex) => {
    setExamples((prevExamples) => prevExamples.filter((_, index) => index !== exampleIndex));
  };

  const renderParameterTable = (paramList) => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              {examples.map((example, index) => (
                <TableCell key={index}>
                  <Typography variant="subtitle2">
                    {`Example ${index + 1}`}
                    <IconButton
                      onClick={() => handleRemoveExample(index)}
                      color="error"
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paramList.map((param) => (
              <TableRow key={param}>
                <TableCell style={{ "minWidth": "20%" }}>{param}</TableCell>
                {examples.map((example, index) => (
                  <TableCell key={`${index}_${param}`}>
                    <TextField
                      fullWidth
                      multiline
                      variant="outlined"
                      label={param}
                      value={example["parameters"][param] || ''}
                      placeholder={`Enter value for ${param}`}
                      onChange={(e) => handleParameterChange(param, e.target.value, index)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow key="final_prompt">
              <TableCell>Final prompt</TableCell>
              {finalPrompts.map((text, index) => (
                <TableCell key={index}>
                  <pre style={{ "whiteSpace": "pre-wrap" }}>{text}</pre>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        placeholder="Enter your prompt here..."
        label="Prompt"
        value={newPromptText}
        onChange={(e) => setNewPromptText(e.target.value)}
      />
      {parameters.length > 0 && (
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddExample}
            sx={{ marginTop: 2 }}
          >
            Add Example
          </Button>
        </div>
      )}
      {parameters.length > 0 && renderParameterTable(parameters)}
    </div>
  );
};

export default PromptField;
