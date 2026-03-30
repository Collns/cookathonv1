import express from 'express'
import Recipe from '../models/Recipe.js'
import auth from '../middleware/auth.js'
import {
  formatInstructionsAI,
  generateTitleAI,
  isDuplicateRecipe
} from '../utils/formatter.js'
import { recommendRecipesAI } from '../utils/recommend.js'
import { validateRecipe } from '../middleware/validator.js'

const router = express.Router()

// GET: public — no auth required
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll()
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST: auth required — userId comes from token, not body
router.post('/', auth, validateRecipe, async (req, res) => {
  try {
    let { title, ingredients, instructions } = req.body
    const userId = req.user.id // ✅ S1-07: read from token not body

    if (!ingredients || !instructions) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const formattedInstructions = await formatInstructionsAI(instructions)
    const cleanedIngredients = ingredients.trim().toLowerCase()

    if (!title || title.length < 4) {
      title = await generateTitleAI(`${ingredients}\n${instructions}`)
    }

    const isDup = await isDuplicateRecipe(`${title} ${formattedInstructions}`)
    if (isDup) {
      return res.status(409).json({ error: 'Duplicate or spammy recipe detected.' })
    }

    const recipe = await Recipe.create({
      title,
      ingredients: cleanedIngredients,
      instructions: formattedInstructions,
      userId,
      approved: true
    })

    res.status(201).json({ recipe, message: 'Recipe submitted successfully.' })
  } catch (err) {
    console.error('❌ Recipe creation failed:', err.message)
    res.status(500).json({ error: 'Recipe could not be posted.' })
  }
})

// POST /recommend: auth required
router.post('/recommend', auth, async (req, res) => {
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