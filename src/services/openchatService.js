// src/services/openchatService.js

import { buildAnswer } from './aiServiceCommon';

const BASE_URL = 'https://api-inference.huggingface.co/models/openchat/openchat_3.5';

export const hfParameters = [
  {
    id: "top_k",
    type: "int",
    label: "Top K",
    default: "",
    min: 0,
    step: 1,
    fullWidth: false
  },
  {
    id: "top_p",
    type: "float",
    label: "Top P",
    default: "",
    min: 0,
    step: 0.1,
    fullWidth: false
  },
  {
    id: "temperature",
    type: "float",
    label: "Temperature",
    default: 1,
    min: 0,
    max: 100,
    step: 0.1,
    fullWidth: false
  },
  {
    id: "repetition_penalty",
    type: "float",
    label: "Repetition Penalty",
    default: "",
    min: 0,
    max: 100,
    step: 0.1,
    fullWidth: false
  },
  {
    id: "max_new_tokens",
    type: "int",
    label: "Max New Tokens",
    default: "",
    min: 0,
    max: 250,
    step: 1,
    fullWidth: false
  },
  {
    id: "max_time",
    type: "float",
    label: "Max Time",
    default: "",
    min: 0,
    max: 120,
    step: 1,
    fullWidth: false
  },
  {
    id: "return_full_text",
    type: "bool",
    label: "Return full text",
    default: true,
    fullWidth: false
  },
  {
    id: "num_return_sequences",
    type: "int",
    label: "Num Return Sequences",
    default: 1,
    min: 0,
    step: 1,
    fullWidth: false
  },
  {
    id: "do_sample",
    type: "bool",
    label: "Do Sample",
    default: true,
    fullWidth: false
  },
];

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

  if (response.status !== 200) {
    const text = await response.text();
    return {
      "status": response.status,
      "raw": text,
      errorMessage: text,
      answer: null
    };
  }

  const data = await response.json();
  return buildAnswer(response.status, data);
};

export default getOpenchatResponse;
