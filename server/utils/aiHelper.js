import axios from 'axios';
import axiosRetry from 'axios-retry';

// Optional: retry failed DeepSeek calls up to 2 times
axiosRetry(axios, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

export const askAI = async (message) => {
  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are Recipia, a helpful and concise sous chef. Only answer cooking-related questions using fewer than 50 words.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const rawText = response?.data?.choices?.[0]?.message?.content || '';
    const cleanText = rawText
      .replace(/\n\n###.*$/, '')     // Strip markdown headers if present
      .replace(/\s+/g, ' ')          // Normalize spacing
      .trim();

    return cleanText || "Hmm, I couldn’t come up with anything. Try again!";
  } catch (error) {
    console.error('❌ DeepSeek API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return "The AI chef is busy. Please try again in a minute!";
  }
};
