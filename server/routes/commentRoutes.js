import express from 'express';
import { createComment, getCommentsByRecipe, getCommentsByUser } from '../controller/commentsController.js';
import { moderateComment } from '../middleware/moderate.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST: auth required — moderate then create
router.post('/', auth, moderateComment, createComment);

// GET: public — no auth required
router.get('/', async (req, res) => {
  const { recipeId, userId } = req.query;
  if (recipeId) return getCommentsByRecipe(req, res);
  if (userId) return getCommentsByUser(req, res);
  return res.status(400).json({ error: 'recipeId or userId required' });
});

export default router;