import express from 'express'
import Comment from '../models/Comment.js'

const router = express.Router()

// POST: Add a comment
router.post('/', async (req, res) => {
  const { userId, recipeId, content } = req.body
  try {
    const comment = await Comment.create({ userId, recipeId, content })
    res.status(201).json(comment)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET: Get all comments (optional filter by recipeId)
router.get('/', async (req, res) => {
  const { recipeId, userId } = req.query;

  try {
    const where = {};
    if (recipeId) where.recipeId = recipeId;
    if (userId) where.userId = userId;

    const comments = await Comment.findAll({ where });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router
