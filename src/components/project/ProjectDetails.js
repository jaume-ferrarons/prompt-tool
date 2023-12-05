// src/components/project/ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReactMarkdown from 'react-markdown';
import PromptForm from './PromptForm';
import { addPrompt, getPromptsByProjectId, addAnswer, getAllAnswersByProjectId } from '../../utils/indexedDB';
import cohereApiRequest from '../../services/cohereService';
import openchatApiRequest from '../../services/openchatService';
import ModelSelection from './ModelSelection';

const ProjectDetails = ({ getProjectById }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [cohereResponse, setCohereResponse] = useState({});
  const [openChatResponse, setOpenChatResponse] = useState({});
  const [selectedModel, setSelectedModel] = useState('cohere'); // Default model
  const [isLoading, setIsLoading] = useState({}); // Track loading state for each prompt
  const [newPromptText, setNewPromptText] = useState(''); // Track the text of the new prompt

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
  
    // Load answers from the database if available
    const answersFromDB = await getAllAnswersByProjectId(projectId);
    answersFromDB.forEach((answer) => {
      if (answer.model === 'cohere') {
        setCohereResponse((prevResponse) => ({ ...prevResponse, [answer.promptText]: answer.answer }));
      } else if (answer.model === 'openchat') {
        setOpenChatResponse((prevResponse) => ({ ...prevResponse, [answer.promptText]: answer.answer }));
      }
    });
  };

  const handleCreatePrompt = async () => {
    try {
      // Add the prompt to the indexedDB
      const promptId = await addPrompt({ projectId: project.id, text: newPromptText, model: selectedModel });
      const newPrompt = { id: promptId, projectId: project.id, text: newPromptText, model: selectedModel };
      setPrompts([newPrompt, ...prompts]);
  
      // Reset the text area
      setNewPromptText('');
  
      // Run the prompt with the selected model
      await handleGenerateResponse(newPromptText);
  
    } catch (error) {
      console.error('Error creating prompt:', error.message);
    }
  };

  const handleGenerateResponse = async (promptText) => {
    try {
      setIsLoading((prevLoading) => ({ ...prevLoading, [promptText]: true }));

      // Call the selected model
      const model = models.find((m) => m.name === selectedModel);
      const modelResponse = await model.apiRequest(promptText);

      // Update state based on the selected model
      if (selectedModel === 'cohere') {
        setCohereResponse((prevResponse) => ({ ...prevResponse, [promptText]: modelResponse }));
      } else if (selectedModel === 'openchat') {
        setOpenChatResponse((prevResponse) => ({ ...prevResponse, [promptText]: modelResponse }));
      }

      // Add the answer to the indexedDB for future reference
      await addAnswer({ projectId: project.id, model: selectedModel, promptText, answer: modelResponse });

    } catch (error) {
      console.error('Error generating response:', error.message);
    } finally {
      setIsLoading((prevLoading) => ({ ...prevLoading, [promptText]: false }));
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <ModelSelection
                models={models}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
              />
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreatePrompt}
              >
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
              <TableCell>Play</TableCell>
              <TableCell>Prompt</TableCell>
              <TableCell>Model Used</TableCell>
              <TableCell>Model Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell>
                  <Button
                    onClick={() => handleGenerateResponse(prompt.text)}
                    disabled={isLoading[prompt.text]}
                    startIcon={<PlayCircleOutlineIcon />}
                  >
                    {isLoading[prompt.text] ? 'Processing...' : 'Play'}
                  </Button>
                </TableCell>
                <TableCell>{prompt.text}</TableCell>
                <TableCell>{prompt.model}</TableCell>
                <TableCell>
                  <ReactMarkdown>{cohereResponse[prompt.text] || openChatResponse[prompt.text] || ''}</ReactMarkdown>
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
