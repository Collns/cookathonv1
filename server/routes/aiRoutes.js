import express from 'express'
import { recommendRecipesAI } from '../utils/recommend.js'
const router = express.Router()

// POST /api/ai/generate
router.post('/recommend', async (req, res) => {
  const { ingredients } = req.body

  if (!ingredients) {
    return res.status(400).json({ error: 'Ingredients required' })
  }

  try {
    const results = await recommendRecipesAI(ingredients)
    res.json(results)
  } catch (err) {
    console.error('🧠 Recommend route error:', err.message)
    res.status(500).json({ error: 'AI recommendation failed' })
  }
})

router.post('/generate', async (req, res) => {
  const { ingredients } = req.body
  if (!ingredients) return res.status(400).json({ error: 'Ingredients are required' })

  try {
    const suggestions = await recommendRecipes(ingredients)
    res.json(suggestions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router