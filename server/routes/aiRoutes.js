import express from 'express';
import { recommendRecipesAI } from '../utils/recommend.js';
import { formatInstructionsAI, generateTitleAI } from '../utils/formatter.js';
import { askAI } from '../utils/aiHelper.js';
const router = express.Router();

// 🔁 Fix: working DeepSeek recommend route
router.post('/recommend', async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).json({ error: 'Ingredients required' });

  try {
    const suggestions = await recommendRecipesAI(ingredients);
    res.json({ suggestions });
  } catch (err) {
    console.error('❌ Recommend failed:', err.message);
    res.status(500).json({ error: 'Recommendation failed' });
  }
})

// ✨ Generate recipe title from instructions
router.post('/generate', async (req, res) => {
  const { instructions } = req.body;
  if (!instructions) return res.status(400).json({ error: 'Instructions required' });

  try {
    const title = await generateTitleAI(instructions);
    res.json({ title });
  } catch (err) {
    console.error('❌ Title generation failed:', err.message);
    res.status(500).json({ error: 'Title generation failed' });
  }
})

// 🧠 General chatbot support
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const reply = await askAI(message);
    res.json({ reply });
  } catch (err) {
    console.error('❌ Chat AI failed:', err.message);
    res.status(500).json({ error: 'AI chat failed' });
  }
})

router.post('/format', async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Missing text' })
  const result = await formatInstructionsAI(text)
  res.json({ formatted: result })
})

router.post('/title', async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Missing text' })
  const result = await generateTitleAI(text)
  res.json({ title: result })
})

router.post('/recommend', async (req, res) => {
  const { ingredients } = req.body
  if (!ingredients) return res.status(400).json({ error: 'Missing ingredients' })
  const result = await recommendRecipesAI(ingredients)
  res.json(result)
});

export default router;
