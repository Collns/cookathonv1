import express from 'express'
import Recipe from '../models/Recipe.js'
import { formatText } from '../utils/formatter.js';

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll()
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, ingredients, instructions, userId } = req.body;

    if (!title || !ingredients || !instructions || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 🧼 Format and sanitize
    const formattedTitle = formatText(title);
    const formattedInstructions = formatText(instructions);
    const cleanedIngredients = ingredients.trim().toLowerCase();

    const recipe = await Recipe.create({
      title: formattedTitle,
      ingredients: cleanedIngredients,
      instructions: formattedInstructions,
      userId
    });

    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

export default router
