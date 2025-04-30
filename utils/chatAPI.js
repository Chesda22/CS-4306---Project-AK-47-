import axios from 'axios';


const API_KEY = 'sk-c9e74287ca3d46178c455ea9708813d8';
const API_URL = 'https://api.openai.com/v1/chat/completions'; // works with DeepSeek too

export const sendToGPT = async (text) => {
  const response = await axios.post(
    API_URL,
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant specialized in climate change and carbon footprint guidance.' },
        { role: 'user', content: text }
      ],
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content.trim();
};
