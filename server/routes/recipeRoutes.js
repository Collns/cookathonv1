import express from 'express'
import Recipe from 'server\models\Recipe.js'

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
  const { title, ingredients, instructions } = req.body
  try {
    const newRecipe = await Recipe.create({ title, ingredients, instructions })
    res.status(201).json(newRecipe)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
