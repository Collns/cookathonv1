import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create user
router.post('/', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const newUser = await User.create({ username, email, password })
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
