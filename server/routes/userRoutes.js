import express from 'express'
import User from '../models/User.js'
import Recipe from '../models/Recipe.js'  // needed for including user's recipes in profile

const router = express.Router()

/**
 * GET /api/users
 * Public route — returns all users
 * Excludes sensitive fields: password hash, banned/flagged status
 * These fields are internal and should never be exposed to the client
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'banned', 'flagged'] }
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/users/:id
 * Public route — returns a single user's profile
 * 
 * - Same field exclusions as GET / (no password, banned, flagged)
 * - Includes the user's approved recipes via Sequelize association
 * - required: false = LEFT JOIN, so users with 0 recipes still return
 * - where: { approved: true } = only show recipes that passed moderation
 * - Returns 404 if user ID doesn't exist
 * 
 * Used by: frontend profile page (/users/:id) — see S4-05
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'banned', 'flagged'] },
      include: [{
        model: Recipe,
        attributes: ['id', 'title', 'createdAt'],
        where: { approved: true },
        required: false  // LEFT JOIN — don't exclude users with no recipes
      }]
    })

    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/users
 * Legacy user creation route — will be replaced by /api/auth/register (S1-05)
 * Kept for now to avoid breaking anything until auth routes are wired up
 * WARNING: returns full user object including password hash — S1-05 fixes this
 */
router.post('/', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const newUser = await User.create({ username, email, password })
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/**
 * PUT /api/users/:id
 * Update user profile — currently unprotected
 * S1-11 will add: auth middleware, ownership check (only you or admin can edit),
 * and safe response (exclude password from returned object)
 */
router.put('/:id', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Only update fields that were actually sent in the request
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;  // bcrypt beforeUpdate hook auto-hashes

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

export default router