// src/services/openchatService.js
const BASE_URL = 'https://api-inference.huggingface.co/models/openchat/openchat_3.5';

const getOpenchatResponse = async (inputs) => {
  const openchatApiKey = localStorage.getItem('openchatApiKey');

  if (!openchatApiKey) {
    throw new Error('OpenChat API key not found in local storage.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openchatApiKey}`,
  };

  const body = {
    inputs,
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`OpenChat API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export default getOpenchatResponse;
