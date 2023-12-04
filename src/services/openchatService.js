// src/services/openchatService.js
const API_URL = 'https://api-inference.huggingface.co/models/openchat/openchat_3.5';

const openchatApiRequest = async (prompt) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `GPT4 Correct User: ${prompt}<|end_of_turn|>GPT4 Correct Assistant:`,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenChat API request failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling OpenChat API:', error.message);
    throw error;
  }
};

export default openchatApiRequest;
