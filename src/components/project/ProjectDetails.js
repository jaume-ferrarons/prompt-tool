// src/components/project/ProjectDetails.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { addPrompt, getPromptsByProjectId, addAnswer } from '../../utils/indexedDB';
import cohereApiRequest from '../../services/cohereService';
import openchatApiRequest from '../../services/openchatService';
import ModelSelection from './ModelSelection';
import ReplayIcon from '@mui/icons-material/Replay';

const ProjectDetails = ({ getProjectById }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [newPromptText, setNewPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState('cohere'); // Default model
  const [isLoading, setIsLoading] = useState({}); // Track loading state for each prompt
  const stateRef = useRef();
  stateRef.prompts = prompts

  const models = [
    { name: 'cohere', apiRequest: cohereApiRequest },
    { name: 'openchat', apiRequest: openchatApiRequest },
  ];

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

  const handleCreatePrompt = async () => {
    try {

      // Add the prompt to the indexedDB with computed answer
      const promptId = await addPrompt({
        projectId: project.id,
        text: newPromptText,
        model: selectedModel,
      });

      const newPrompt = {
        id: promptId,
        projectId: project.id,
        text: newPromptText,
        model: selectedModel,
        answer: null, // Set to null initially, will be updated after computation
      };

      // Add the new prompt to the state immediately
      setPrompts([newPrompt, ...stateRef.prompts]);

      // Reset the text area
      // setNewPromptText('');

      // Compute and update the answer
      computePromptAnswer(newPrompt);
    } catch (error) {
      console.error('Error creating prompt:', error.message);
    }
  };

  const computePromptAnswer = async (prompt) => {
    try {
      const model = models.find((m) => m.name === prompt.model);

      setIsLoading((prevLoading) => ({ ...prevLoading, [prompt.id]: true }));

      // Call the selected model
      const modelResponse = await model.apiRequest(prompt.text);

      // Update state based on the selected model
      console.log({"len before": prompts.length})
      const updatedPrompts = stateRef.prompts.map((prevPrompt) =>
      prevPrompt.id === prompt.id ? { ...prevPrompt, answer: modelResponse } : prevPrompt
      );
      console.log(prompts);
      console.log(updatedPrompts);
      console.log({"len before": prompts.length, "len after": updatedPrompts.length})
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
  };

  const handleReprocessPrompt = (prompt) => {
    // Check if the prompt is currently being processed
    const isProcessing = isLoading[prompt.id];

    if (!isProcessing) {
      // Reprocess the prompt and update the answer
      computePromptAnswer(prompt);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <ModelSelection models={models} selectedModel={selectedModel} onSelectModel={setSelectedModel} />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter your prompt here..."
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" color="primary" onClick={handleCreatePrompt}>
                Create Prompt
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prompt</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell>{prompt.text}</TableCell>
                <TableCell>{prompt.model}</TableCell>
                <TableCell>
                  {prompt.answer !== null ? (
                    <ReactMarkdown>{prompt.answer || ''}</ReactMarkdown>
                  ) : (
                    <>
                      {isLoading[prompt.id] ? (
                        <CircularProgress size={24} sx={{ marginRight: 2 }} />
                      ) : (
                        <Button
                          onClick={() => handleReprocessPrompt(prompt)}
                          startIcon={<ReplayIcon />}
                          disabled={isLoading[prompt.id]}
                        >
                          Reprocess
                        </Button>
                      )}
                    </>
                  )}
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
