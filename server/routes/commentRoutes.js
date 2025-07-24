// Updated commentRoutes.js to integrate DeepSeek moderation middleware
import express from 'express';
import { createComment, getCommentsByRecipe, getCommentsByUser } from '../controller/commentsController.js';
import { moderateComment } from '../middleware/moderate.js';

const router = express.Router();

// 🚫 Moderate comment content using DeepSeek before saving
router.post('/', moderateComment, createComment);

// ✅ Get comments by recipeId or userId
router.get('/', async (req, res) => {
  const { recipeId, userId } = req.query;

  if (recipeId) return getCommentsByRecipe(req, res);
  if (userId) return getCommentsByUser(req, res);

  return res.status(400).json({ error: 'recipeId or userId required' });
});

export default router;
