// src/components/project/ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
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
    setPrompts(promptsFromDB);

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

  const handleCreatePrompt = async (promptText) => {
    try {
      // Add the prompt to the indexedDB
      const promptId = await addPrompt({ projectId: project.id, text: promptText });
      const newPrompt = { id: promptId, projectId: project.id, text: promptText };
      setPrompts([...prompts, newPrompt]);

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
      <h2>{project && project.name}</h2>
      <ModelSelection
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />
      <PromptForm onCreatePrompt={handleCreatePrompt} />
      {/* Display prompts and model answers in a table */}
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Play</th>
            <th>Prompt</th>
            <th>Model Answer</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => (
            <tr key={prompt.id}>
              <td>
                <button onClick={() => handleGenerateResponse(prompt.text)}>
                  {isLoading[prompt.text] ? (
                    <div style={{ width: '24px', height: '24px', border: '2px solid #ccc', borderRadius: '50%', borderTop: '2px solid #3498db', animation: 'spin 1s linear infinite' }}></div>
                  ) : (
                    // PlayCircleOutlineIcon for Play button
                    <PlayCircleOutlineIcon />
                  )}
                </button>
              </td>
              <td>{prompt.text}</td>
              <td>{cohereResponse[prompt.text] || openChatResponse[prompt.text] || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Additional details and associations with templates/examples */}
    </div>
  );
};

export default ProjectDetails;
