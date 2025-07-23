import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export const askAI = async (message) => {
  try {
    const sousChefPrompt = "You are a helpful sous chef. Only answer cooking, recipe, or kitchen questions. If the question is not about cooking, politely say you can only help with cooking.";
    const fullMessage = `${sousChefPrompt}\nUser: ${message}`;
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      { inputs: fullMessage },
      {
        headers: {
          Authorization: `Bearer ${process.env.HFC_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.generated_text || 'Sorry, I didn’t catch that.';
  } catch (err) {
    console.error('❌ Hugging Face AI error:', err.message);
    return 'Oops! Something went wrong with the AI.';
  }
}