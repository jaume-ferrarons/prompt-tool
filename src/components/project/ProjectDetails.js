// src/components/project/ProjectDetails.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { addPrompt, getPromptsByProjectId, addAnswer } from '../../utils/indexedDB';
import cohereApiRequest from '../../services/cohereService';
import openchatApiRequest from '../../services/openchatService';
import ModelSelection from './ModelSelection';
import ReplayIcon from '@mui/icons-material/Replay';
import CodeIcon from '@mui/icons-material/Code';
import PromptField from './PromptField';

const ProjectDetails = ({ getProjectById }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [prompts, setPrompts] = useState([]); // Define prompts state
  const [showRawAnswer, setShowRawAnswer] = useState(false); // Define prompts state
  const [newPromptText, setNewPromptText] = useState(''); // Define newPromptText state
  const [selectedModel, setSelectedModel] = useState('cohere'); // Define selectedModel state
  const [isLoading, setIsLoading] = useState({});
  const stateRef = useRef();
  stateRef.prompts = prompts;

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
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} md={10}>
            <PromptField
              onChange={(updatedPrompt) => setNewPromptText(updatedPrompt)}
            />
        </Grid>
        <Grid item xs={12} md={2}>
          <Grid spacing={2} justifyContent="center" alignItems="center" container direction="column">
            <ModelSelection models={models} selectedModel={selectedModel} onSelectModel={setSelectedModel} />
            <Button variant="contained" color="primary" onClick={handleCreatePrompt} fullWidth>
              Execute Prompt
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prompt</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>
                Answer
                <ToggleButton
                  value="check"
                  selected={showRawAnswer}
                  onChange={() => {
                    setShowRawAnswer(!showRawAnswer);
                  }}
                >
                  <CodeIcon />
                </ToggleButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell><pre>{prompt.text}</pre></TableCell>
                <TableCell>{prompt.model}</TableCell>
                <TableCell>
                  {prompt.answer !== null ? (
                    <>
                      {showRawAnswer ? <pre>{prompt.answer || ''}</pre> : <ReactMarkdown>{prompt.answer || ''}</ReactMarkdown>}
                    </>
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
