// routes/adminRoutes.js
import express from 'express'
import Recipe from '../models/Recipe.js'
import User from '../models/User.js'

const router = express.Router()

// GET all unapproved recipes
router.get('/unapproved-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ where: { approved: false } })
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Approve recipe (admin only)
router.put('/recipes/:id/approve', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id)
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' })

    recipe.approved = true
    await recipe.save()

    res.json({ message: 'Recipe approved', recipe })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Revoke approval
router.put('/recipes/:id/revoke', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id)
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' })

    recipe.approved = false
    await recipe.save()

    res.json({ message: 'Recipe unapproved', recipe })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE: Remove recipe completely
router.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id)
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' })

    await recipe.destroy()
    res.json({ message: 'Recipe deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH: Ban a user
router.patch('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    user.banned = true
    await user.save()

    res.json({ message: 'User banned', user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
