// utils/chatAPI.js

import Constants from 'expo-constants';

// Expo CLI v5+ populates expoConfig, not manifest, in local runs:
const config = Constants.manifest ?? Constants.expoConfig;
const DEEPSEEK_KEY = config?.extra?.deepseekApiKey;

export const sendToGPT = async (userInput) => {
  console.log('DeepSeek key:', DEEPSEEK_KEY);

  if (!DEEPSEEK_KEY) {
    console.error('❌ Missing DeepSeek API key in expoConfig.extra.deepseekApiKey');
    return '⚠️ Configuration error: missing API key.';
  }

  try {
    const response = await fetch(
      'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DEEPSEEK_KEY}`,
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

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', errText);
      throw new Error(errText);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (error) {
    console.error('Error fetching from DeepSeek:', error);
    return '⚠️ Failed to get a response from the chatbot.';
  }
};
