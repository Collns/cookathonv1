import express from 'express'
import Like from '../models/Like.js'
import Recipe from '../models/Recipe.js'
import { Op } from 'sequelize'

const router = express.Router()

// POST: Like a recipe
router.post('/', async (req, res) => {
  const { userId, recipeId } = req.body
  try {
    const [like, created] = await Like.findOrCreate({ where: { userId, recipeId } })

    if (created) {
      // Optionally increment likeCount
      await Recipe.increment('likeCount', { where: { id: recipeId } })
    }

    res.status(201).json({ liked: created })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE: Unlike a recipe
router.delete('/', async (req, res) => {
  const { userId, recipeId } = req.body
  try {
    const deleted = await Like.destroy({ where: { userId, recipeId } })

    if (deleted) {
      await Recipe.decrement('likeCount', { where: { id: recipeId } })
    }

    res.json({ unliked: !!deleted })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET: All likes by user (optional)
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      order: [['createdAt', 'DESC']]
    })

    // Map recipeId => likeCount
    const counts = await Like.findAll({
      attributes: ['recipeId'],
      raw: true
    })

    const likeMap = counts.reduce((acc, row) => {
      acc[row.recipeId] = (acc[row.recipeId] || 0) + 1
      return acc
    }, {})

    // Add likeCount dynamically
    const recipesWithLikes = recipes.map(r => {
      const recipe = r.toJSON()
      recipe.likeCount = likeMap[recipe.id] || 0
      return recipe
    })

    res.json(recipesWithLikes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
