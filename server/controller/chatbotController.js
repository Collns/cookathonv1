import { askAI } from '../utils/aiHelper.js';

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string.' });
  }

  try {
    const reply = await askAI(message);
    res.json({ reply });
  } catch (err) {
    console.error('❌ AI Chat Error:', err.message);
    res.status(500).json({
      error: 'AI service failed.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
