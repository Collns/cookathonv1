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

router.put('/:id', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Optional fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // bcrypt hook will hash it

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

export default router
