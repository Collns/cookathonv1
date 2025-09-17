import Comment from '../models/comment.js';

export const createComment = async (req, res) => {
  try {
    const { userId, recipeId, content } = req.body;

    if (!userId || !recipeId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newComment = await Comment.create({ userId, recipeId, content });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment', details: err.message });
  }
};

export const getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.query;
    const comments = await Comment.findAll({ where: { recipeId } });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipe comments', details: err.message });
  }
};

export const getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const comments = await Comment.findAll({ where: { userId } });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user comments', details: err.message });
  }
};
