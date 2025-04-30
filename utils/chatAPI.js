// utils/chatAPI.js

import Constants from 'expo-constants';

const DEEPSEEK_KEY = Constants.manifest.extra.deepseekApiKey;

export const sendToGPT = async (userInput) => {
  try {
    const response = await fetch(
      'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,  // ← use the Expo extra key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant for climate and carbon footprint questions.',
            },
            { role: 'user', content: userInput },
          ],
          temperature: 0.7,
        }),
      }
    );

    // If the call failed (e.g. auth error), get the plain-text message
    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', errText);
      throw new Error(errText);
    }

    // Parse and return the assistant's reply
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (error) {
    console.error('Error fetching from DeepSeek:', error);
    return '⚠️ Failed to get a response from the chatbot.';
  }
};
