// src/services/cohereService.js
const BASE_URL = 'https://api.cohere.ai/v1/chat';

const getCohereResponse = async (prompt) => {
  const cohereApiKey = localStorage.getItem('cohereApiKey');

  if (!cohereApiKey) {
    throw new Error('Cohere API key not found in local storage.');
  }

  const headers = {
    'Authorization': `Bearer ${cohereApiKey}`,
    'Content-Type': 'application/json',
  };

  const body = {
    model: 'command',
    message: prompt,
    temperature: 0.3,
    chat_history: [],
    prompt_truncation: 'AUTO',
    stream: false,
    citation_quality: 'accurate',
    connectors: [],
    documents: [],
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Cohere API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data["text"];
};

export default getCohereResponse;
