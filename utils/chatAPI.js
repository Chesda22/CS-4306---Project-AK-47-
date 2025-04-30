export const sendToGPT = async (userInput) => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'sk-c9e74287ca3d46178c455ea9708813d8', // ← replace this
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for climate and carbon footprint questions.' },
          { role: 'user', content: userInput },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = await response.text();
    console.log("🔎 Raw response:", text);
    const data = JSON.parse(text);

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error fetching from DeepSeek:', error);
    return '⚠️ Failed to get a response from the chatbot.';
  }
};
