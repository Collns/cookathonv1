/**
 * Admin Routes — /api/admin
 * 
 * All routes protected by auth + isAdmin via router.use()
 * No token = 401, valid token but role != admin = 403
 * 
 * Protected by: S1-06 (isAdmin middleware)
 * Frontend wired in: S4-07 (Admin Panel UI)
 */
import express from 'express'
import Recipe from '../models/Recipe.js'
import User from '../models/User.js'
import auth from '../middleware/auth.js'
import isAdmin from '../middleware/isAdmin.js'

const router = express.Router()

/**
 * Protect every route in this file
 * auth runs first (verifies JWT, sets req.user)
 * isAdmin runs second (checks req.user.role === "admin")
 */
router.use(auth, isAdmin)

// GET all unapproved recipes — for admin moderation queue
router.get('/unapproved-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ where: { approved: false } })
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT: Approve a recipe — moves it from moderation queue to public feed
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

// PUT: Revoke approval — pulls a recipe back from public feed
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

// DELETE: Remove a recipe permanently
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

// PATCH: Ban a user — prevents them from logging in (checked in authRoutes login)
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

// GET all users — admin user management view
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router