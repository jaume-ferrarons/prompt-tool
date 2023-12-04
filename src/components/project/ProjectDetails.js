// src/components/project/ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PromptForm from './PromptForm';
import { addPrompt, getPromptsByProjectId } from '../../utils/indexedDB';

const ProjectDetails = ({ getProjectById }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [prompts, setPrompts] = useState([]);

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
  };

  const handleCreatePrompt = async (promptText) => {
    const promptId = await addPrompt({ projectId: project.id, text: promptText });
    const newPrompt = { id: promptId, projectId: project.id, text: promptText };
    setPrompts([...prompts, newPrompt]);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{project.name}</h2>
      <PromptForm onCreatePrompt={handleCreatePrompt} />
      {/* Display existing prompts */}
      <ul>
        {prompts.map((prompt) => (
          <li key={prompt.id}>{prompt.text}</li>
        ))}
      </ul>
      {/* Additional details and associations with templates/examples */}
    </div>
  );
};

export default ProjectDetails;
