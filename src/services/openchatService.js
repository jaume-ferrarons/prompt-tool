// src/services/openchatService.js

import { buildAnswer } from './aiServiceCommon';

const BASE_URL = 'https://api-inference.huggingface.co/models/openchat/openchat_3.5';

function removeEmpty(parameters) {
  const result = {};
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== "") {
      result[key] = value;
    }
  }
  return result;
}


const getOpenchatResponse = async (inputs, parameters) => {
  const openchatApiKey = localStorage.getItem('openchatApiKey');

  if (!openchatApiKey) {
    throw new Error('OpenChat API key not found in local storage.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openchatApiKey}`,
  };

  const body = {
    inputs: `GPT4 Correct User: ${inputs}<|end_of_turn|>GPT4 Correct Assistant:`,
    parameters: removeEmpty(parameters)
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return buildAnswer(response.status, data);
};

export default getOpenchatResponse;
