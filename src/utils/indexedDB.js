// src/utils/indexedDB.js
import Dexie from 'dexie';

const db = new Dexie('AI_Tool_DB');

db.version(4).stores({
    projects: '++id,name',
    prompts: '++id,projectId,text',
    answers: '++id,projectId,model,promptId,answer,promptText',
});

export const addProject = async (project) => {
    const projectId = await db.projects.add(project);
    return projectId;
};

export const getAllProjects = async () => {
    return db.projects.toArray();
};

export const getProjectById = async (projectId) => {
    return db.projects.get(projectId);
};


export const addPrompt = async (prompt) => {
    const promptId = await db.prompts.add(prompt);
    return promptId;
};

export const getPromptsByProjectId = async (projectId) => {
    return db.prompts.where('projectId').equals(projectId).toArray();
};

export const addAnswer = async (answerData) => {
    return await db.answers.add(answerData);
  };
  
  export const getAllAnswersByProjectId = async (projectId) => {
    return await db.answers.where('projectId').equals(projectId).toArray();
  };