// src/utils/indexedDB.js
import Dexie from 'dexie';

const db = new Dexie('AI_Tool_DB');

db.version(7).stores({
    projects: '++id,name',
    prompts: '++id,projectId,text,model,answer', // Merged prompts and answers
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
    const { projectId, model, promptId } = answerData;

    // Check if the record already exists
    const existingRecord = await db.prompts.get({ projectId, model, id: promptId });

    // If the record exists, update it; otherwise, add a new one
    if (existingRecord) {
        await db.prompts.update(existingRecord.id, answerData);
    } else {
        await db.prompts.add(answerData);
    }
};
