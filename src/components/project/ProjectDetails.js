// src/components/project/ProjectDetails.js
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button, CircularProgress, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  ToggleButton, ToggleButtonGroup,
  Tabs, Tab, Box
} from '@mui/material';
import { addPrompt, getPromptsByProjectId, addAnswer } from '../../utils/indexedDB';
import ModelSelection from './ModelSelection';
import ReplayIcon from '@mui/icons-material/Replay';
import PromptField from './PromptField';
import Answer from '../prompt/answer.js';
import { models } from '../../services/modelRegistry.js';
import ComparisonMode from './ComparisonMode.js';

const ProjectDetails = ({ getProjectById }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [prompts, setPrompts] = useState([]); // Define prompts state
  const [showRawAnswer, setShowRawAnswer] = useState(false); // Define prompts state
  const [newPromptText, setNewPromptText] = useState([]); // Define newPromptText state
  const [selectedModel, setSelectedModel] = useState({ "model": "cohere", "parameters": {} }); // Define selectedModel state
  const [isLoading, setIsLoading] = useState({});
  const [inputMode, setInputMode] = useState("basic");

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await getProjectById(Number(projectId));
      setProject(projectData);
      loadPrompts(projectData.id);
    };

    fetchProject();
  }, [getProjectById, projectId]);

  const loadPrompts = async (projectId) => {
    const promptsFromDB = await getPromptsByProjectId(projectId);
    setPrompts(promptsFromDB.reverse()); // Reverse to display newest prompts on top
  };

  const setModelResponse = useCallback(async (prompt, modelResponse, cb) => {
    setPrompts((prevPrompts) => prevPrompts.map((prevPrompt) =>
      prevPrompt.id === prompt.id ? { ...prevPrompt, answer: modelResponse } : prevPrompt
    ));

    // Add the answer to the indexedDB for future reference
    const promptData = {
      projectId: project.id,
      model: prompt.model,
      id: prompt.id,
      answer: modelResponse,
      text: prompt.text,
    }

    await addAnswer(promptData);
    if (cb) {
      cb(promptData);
    }
  }, [project])

  const computePromptAnswer = useCallback(async (prompt, cb) => {
    try {
      const model = models[prompt["model"]["model"]];
      setIsLoading((prevLoading) => ({ ...prevLoading, [prompt.id]: true }));
      // Call the selected model
      const modelResponse = await model.apiRequest(prompt.text, prompt["model"]["parameters"]);
      setModelResponse(prompt, modelResponse, cb);
    } catch (error) {
      console.error('Error computing prompt answer:', error.message);
      setModelResponse(prompt, {
        status: -1, raw: error, errorMessage: error.message, answer: null
      }, cb);
    } finally {
      setIsLoading((prevLoading) => ({ ...prevLoading, [prompt.id]: false }));
    }
  }, [setModelResponse]);

  const handleCreatePrompt = useCallback(async (promptText, model, cb) => {
    try {
      // Add the prompt to the indexedDB with computed answer
      const promptId = await addPrompt({
        projectId: project.id,
        text: promptText,
        model: model,
        answer: null,
      });

      const newPrompt = {
        id: promptId,
        projectId: project.id,
        text: promptText,
        model: model,
        answer: null, // Set to null initially, will be updated after computation
      };

      // Add the new prompt to the state immediately
      setPrompts((prevPrompts) => [newPrompt, ...prevPrompts]);

      // Compute and update the answer
      computePromptAnswer(newPrompt, cb);
    } catch (error) {
      console.error('Error creating prompt:', error.message);
    }
  }, [computePromptAnswer, project]);

  const run = useCallback(() => {
    newPromptText.forEach((promptText) => {
      handleCreatePrompt(promptText, selectedModel);
    });
  }, [handleCreatePrompt, newPromptText, selectedModel]);

  const handleReprocessPrompt = useCallback((prompt) => () => {
    // Check if the prompt is currently being processed
    const isProcessing = isLoading[prompt.id];

    if (!isProcessing) {
      // Reprocess the prompt and update the answer
      computePromptAnswer(prompt);
    }
  }, [isLoading, computePromptAnswer]);

  const changeInputMode = useCallback((event, mode) => {
    setInputMode(mode);
  }, []);

  const handleSetShowRawAnswer = useCallback((event) => {
    setShowRawAnswer(event.target.value === "true")
  }, [])

  return (
    <div>
      <Paper sx={{ margin: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={inputMode} onChange={changeInputMode}>
            <Tab label="Basic mode" value="basic" />
            <Tab label="Comparison mode" value="comparison" />
          </Tabs>
        </Box>
        <Box sx={{ padding: 1 }}>
          {inputMode === "comparison" && <ComparisonMode executor={handleCreatePrompt} />}
          {inputMode === "basic" && <>
            <ModelSelection model={selectedModel} onSelectModel={setSelectedModel} />
            <PromptField
              onChange={setNewPromptText}
            />
            <Button variant="contained" color="primary" onClick={run}>
              Run
            </Button>
          </>}
        </Box>
      </Paper>
      {useMemo(() =>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Prompt</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>
                  Answer
                  <ToggleButtonGroup
                    size='small'
                    color="primary"
                    value={showRawAnswer}
                    exclusive
                    onChange={handleSetShowRawAnswer}
                    sx={{ "paddingLeft": "15px" }}
                  >
                    <ToggleButton value={false}>Markdown</ToggleButton>
                    <ToggleButton value={true}>Raw</ToggleButton>
                  </ToggleButtonGroup>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell><pre style={{ "whiteSpace": "pre-wrap" }}>{prompt.text}</pre></TableCell>
                  <TableCell>{models[prompt.model["model"]].displayName}</TableCell>
                  <TableCell>
                    {isLoading[prompt.id] ? (
                      <CircularProgress size={24} sx={{ marginRight: 2 }} />
                    ) : (<Answer answer={prompt.answer} showRaw={showRawAnswer} />)}

                    {!isLoading[prompt.id] && (prompt.answer == null || prompt.answer["status"] !== 200) && <Button
                      onClick={handleReprocessPrompt(prompt)}
                      startIcon={<ReplayIcon />}
                      disabled={isLoading[prompt.id]}
                    >
                      Retry
                    </Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>, [handleReprocessPrompt, handleSetShowRawAnswer, isLoading, prompts, showRawAnswer])}
    </div>
  );
};

export default ProjectDetails;
