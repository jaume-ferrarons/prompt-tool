// src/services/openchatService.js

import { buildAnswer } from './aiServiceCommon';

const BASE_URL = 'https://api-inference.huggingface.co/models/';

export const hfParametersText2Image = [
    {
        id: "model",
        type: "autocomplete",
        label: "model",
        options: ["dataautogpt3/OpenDalleV1.1", "dataautogpt3/OpenDalle", "stabilityai/stable-diffusion-2-1"],
        default: "dataautogpt3/OpenDalleV1.1",
        fullWidth: false
    }
];

export const hfParametersText2Text = [
    {
        id: "model",
        type: "autocomplete",
        label: "model",
        options: ["mistralai/Mistral-7B-v0.1", "openchat/openchat_3.5"],
        default: "mistralai/Mistral-7B-v0.1",
        fullWidth: false
    },
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

const getHFInferenceAPIResponse = (modelType) => async (inputs, parameters) => {
    const hfInferenceApiKey = localStorage.getItem('hfInferenceApiKey');

    if (!hfInferenceApiKey) {
        throw new Error('Huggingface API key not found in local storage.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hfInferenceApiKey}`,
    };

    const { model, other_params } = {
        model: "mistralai/Mistral-7B-v0.1",
        ...parameters
    };

    const body = {
        inputs: inputs,
        parameters: removeEmpty(other_params || {})
    };

    const response = await fetch(BASE_URL + model, {
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

    if (modelType === "text2image") {
        const data = await response.blob();
        const dataURL = await readBlobAsDataURL(data);
        return {
            "status": response.status,
            "raw": null,
            errorMessage: null,
            answer: dataURL,
            "kind": "image"
        };
    }

    const data = await response.json();
    return buildAnswer(response.status, data);
};

export default getHFInferenceAPIResponse;

function readBlobAsDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      // Set up the FileReader onload event
      reader.onload = function (e) {
        // Resolve with the data URL
        resolve(e.target.result);
      };
  
      // Set up the FileReader onerror event
      reader.onerror = function (error) {
        // Reject with the error
        reject(error);
      };
  
      // Read the Blob as a data URL
      reader.readAsDataURL(blob);
    });
  }