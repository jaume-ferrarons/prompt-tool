
import { buildAnswer } from './aiServiceCommon';

const BASE_URL = 'https://api.openai.com/v1/chat/completions';

export const openAIParameters = [
  {
    id: "model",
    type: "select",
    label: "Model",
    options: ["gpt-4", "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4-32k", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"],
    default: "gpt-3.5-turbo",
    fullWidth: false
  },
  {
    id: "temperature",
    type: "float",
    label: "Temperature",
    default: 1.0,
    min: 0,
    max: 2,
    step: 0.1,
    fullWidth: false
  },
  {
    id: "max_tokens",
    type: "int",
    label: "Max tokens",
    default: 256,
    min: 1,
    max: 16384,
    step: 1,
    fullWidth: false
  },
  {
    id: "top_p",
    type: "float",
    label: "Top P",
    default: 1,
    min: 0,
    max: 1,
    step: 0.1,
    fullWidth: false
  },
  {
    id: "frequency_penalty",
    type: "float",
    label: "Frequency Penalty",
    default: 0,
    min: 0,
    max: 2,
    step: 0.1,
    fullWidth: false
  },
  {
    id: "presence_penalty",
    type: "float",
    label: "Presence Penalty",
    default: 0,
    min: 0,
    max: 2,
    step: 0.1,
    fullWidth: false
  }
];

const getOpenAIResponse = async (prompt, parameters) => {
  const openaiApiKey = localStorage.getItem('openaiApiKey');

  if (!openaiApiKey) {
    throw new Error('OpenAI API key not found in local storage.');
  }

  const headers = {
    'Authorization': `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json',
  };


  const body = {
    model: "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": prompt
      }
    ],
    ...parameters
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (response.status === 200) {
    const data = await response.json();
    return {
      status: response.status,
      raw: data,
      errorMessage: null,
      answer: data['choices'][0]['message']['content'],
    }
  }
  else {
    return {
      status: response.status,
      raw: await response.text(),
      errorMessage: response.statusText,
      answer: null
    };
  }
};

export default getOpenAIResponse;
