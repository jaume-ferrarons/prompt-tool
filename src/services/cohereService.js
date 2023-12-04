// src/services/cohereService.js
const API_URL = 'https://api.cohere.ai/v1/chat';

const cohereApiRequest = async (prompt) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer FLiiicrqkVP5vNLkOYDpUq0RJy9sbI5MGr4Aal0G',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        message: prompt,
        temperature: 0.3,
        chat_history: [],
        prompt_truncation: 'AUTO',
        stream: false,
        citation_quality: 'accurate',
        connectors: [],
        documents: [],
      }),
    });

    if (!response.ok) {
      throw new Error('Cohere API request failed');
    }

    const result = await response.json();
    return result["text"];
  } catch (error) {
    console.error('Error calling Cohere API:', error.message);
    throw error;
  }
};

export default cohereApiRequest;
