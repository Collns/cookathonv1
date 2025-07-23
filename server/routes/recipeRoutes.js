import express from 'express'
import Recipe from '../models/Recipe.js'
import {
  formatInstructionsAI,
  generateTitleAI,
  isDuplicateRecipe
} from '../utils/formatter.js'
import { recommendRecipesAI } from '../utils/recommend.js'

const router = express.Router()

// GET: all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll()
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST: create + auto-format + check duplicate
router.post('/', async (req, res) => {
  try {
    let { title, ingredients, instructions, userId } = req.body

    if (!ingredients || !instructions || !userId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 🔍 Format and sanitize
    const formattedInstructions = await formatInstructionsAI(instructions)
    const cleanedIngredients = ingredients.trim().toLowerCase()

    // 🧠 Auto-generate title if missing or too short
    if (!title || title.length < 4) {
      title = await generateTitleAI(`${ingredients}\n${instructions}`)
    }

    // 🚨 Check for duplicate recipes using AI OR string comparison
    const isDup = await isDuplicateRecipe(`${title} ${formattedInstructions}`)
    if (isDup) {
      return res.status(409).json({ error: 'Duplicate or spammy recipe detected.' })
    }

    // ✅ Save recipe
    const recipe = await Recipe.create({
      title,
      ingredients: cleanedIngredients,
      instructions: formattedInstructions,
      userId,
      approved: true  // Later, AI moderation can set this to false
    })

    res.status(201).json({
      recipe,
      message: 'Recipe submitted successfully.'
    })
  } catch (err) {
    console.error('❌ Recipe creation failed:', err.message)
    res.status(500).json({ error: 'Recipe could not be posted.' })
  }
})

// POST /api/recipes/recommend
router.post('/recommend', async (req, res) => {
  const { ingredients } = req.body

  if (!ingredients || ingredients.trim() === '') {
    return res.status(400).json({ error: 'Ingredients required' })
  }

  try {
    const recommended = await recommendRecipesAI(ingredients)
    res.json(recommended)
  } catch (err) {
    console.error('Recommend route error:', err.message)
    res.status(500).json({ error: 'AI recommendation failed' })
  }
})

export default router
