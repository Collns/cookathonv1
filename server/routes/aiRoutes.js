import express from 'express'
import { recommendRecipes } from '../utils/recommend.js'
const router = express.Router()

// POST /api/ai/generate
router.post('/recommend', async (req, res) => {
  const { ingredients } = req.body
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients must be an array of strings' })
  }

  try {
    const recipes = await recommendRecipesByIngredients(ingredients)
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: err.message })
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