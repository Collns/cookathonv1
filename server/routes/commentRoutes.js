import express from 'express'
import { moderateComment } from '../middleware/moderate.js'
import Comment from '../models/Comment.js'

const router = express.Router()

// POST: add and moderate a comment 
router.post(
  '/',
  moderateComment,
  async (req, res) => {
    const { content, userId, recipeId } = req.body
    const comment = await Comment.create({ content, userId, recipeId })
    res.status(201).json(comment)
  }
)

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