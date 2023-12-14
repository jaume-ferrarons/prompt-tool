// src/components/project/ProjectDetails.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button, CircularProgress, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  ToggleButton, ToggleButtonGroup,
  // FormControlLabel, Switch
} from '@mui/material';
import { addPrompt, getPromptsByProjectId, addAnswer } from '../../utils/indexedDB';
import ModelSelection from './ModelSelection';
import ReplayIcon from '@mui/icons-material/Replay';
// import GridOnIcon from '@mui/icons-material/GridOn';
import PromptField from './PromptField';
import Answer from '../prompt/answer.js';
import { models } from '../../services/modelRegistry.js';
// import ComparisonMode from './ComparisonMode.js';

const ProjectDetails = ({ getProjectById }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [prompts, setPrompts] = useState([]); // Define prompts state
  const [showRawAnswer, setShowRawAnswer] = useState(false); // Define prompts state
  const [newPromptText, setNewPromptText] = useState([]); // Define newPromptText state
  const [selectedModel, setSelectedModel] = useState({ "model": "cohere", "parameters": {} }); // Define selectedModel state
  const [isLoading, setIsLoading] = useState({});
  // const [comparisonMode, setComparisonMode] = useState(false);

  const stateRef = useRef();
  stateRef.prompts = prompts;

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

  const computePromptAnswer = useCallback(async (prompt) => {
    try {
      const model = models[prompt["model"]["model"]];

      setIsLoading((prevLoading) => ({ ...prevLoading, [prompt.id]: true }));

      // Call the selected model
      const modelResponse = await model.apiRequest(prompt.text, prompt["model"]["parameters"]);

      // Update state based on the selected model
      const updatedPrompts = stateRef.prompts.map((prevPrompt) =>
        prevPrompt.id === prompt.id ? { ...prevPrompt, answer: modelResponse } : prevPrompt
      );
      setPrompts(updatedPrompts);

      // Add the answer to the indexedDB for future reference
      await addAnswer({
        projectId: project.id,
        model: prompt.model,
        promptId: prompt.id,
        answer: modelResponse,
        text: prompt.text,
      });
    } catch (error) {
      console.error('Error computing prompt answer:', error.message);
    } finally {
      setIsLoading((prevLoading) => ({ ...prevLoading, [prompt.id]: false }));
    }
  }, [project]);

  const handleCreatePrompt = useCallback(async () => {
    newPromptText.map(async (promptText) => {
      try {
        // Add the prompt to the indexedDB with computed answer
        const promptId = await addPrompt({
          projectId: project.id,
          text: promptText,
          model: selectedModel,
          answer: null,
        });

        const newPrompt = {
          id: promptId,
          projectId: project.id,
          text: promptText,
          model: selectedModel,
          answer: null, // Set to null initially, will be updated after computation
        };

        // Add the new prompt to the state immediately
        setPrompts([newPrompt, ...stateRef.prompts]);

        // Compute and update the answer
        computePromptAnswer(newPrompt);
      } catch (error) {
        console.error('Error creating prompt:', error.message);
      }
    })
  }, [computePromptAnswer, newPromptText, project, selectedModel]);

  const handleReprocessPrompt = useCallback((prompt) => () => {
    // Check if the prompt is currently being processed
    const isProcessing = isLoading[prompt.id];

    if (!isProcessing) {
      // Reprocess the prompt and update the answer
      computePromptAnswer(prompt);
    }
  }, [isLoading, computePromptAnswer]);

  // const toggleComparisonMode = useCallback(() => {
  //   setComparisonMode(!comparisonMode);
  // }, [comparisonMode]);

  const handleSetShowRawAnswer = useCallback((event) => {
    setShowRawAnswer(event.target.value === "true")
  }, [])

  return (
    <div>
      {/* <FormControlLabel
        control={<Switch checked={comparisonMode} onChange={toggleComparisonMode} />}
        label={<GridOnIcon />}
      />
      {comparisonMode && <ComparisonMode />} */}
      <ModelSelection model={selectedModel} onSelectModel={setSelectedModel} />
      <PromptField
        onChange={setNewPromptText}
      />
      <Button variant="contained" color="primary" onClick={handleCreatePrompt}>
        Run
      </Button>
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
      </TableContainer>
      {/* Additional details and associations with templates/examples */}
    </div>
  );
};

export default ProjectDetails;
