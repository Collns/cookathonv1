import express from "express";
import Like from "../models/Like.js";
import Recipe from "../models/Recipe.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST: auth required
router.post("/", auth, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user.id; // ✅ S1-07: read from token not body
  try {
    const [like, created] = await Like.findOrCreate({
      where: { userId, recipeId },
    });
    if (created) {
      await Recipe.increment("likeCount", { where: { id: recipeId } });
    }
    res.status(201).json({
      success: true,
      liked: created,
      message: created ? "Recipe liked." : "Already liked.",
    });
  } catch (err) {
    console.error("❌ Like error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// DELETE: auth required
router.delete("/", auth, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user.id; // ✅ S1-07: read from token not body
  try {
    const deleted = await Like.destroy({ where: { userId, recipeId } });
    if (deleted) {
      await Recipe.decrement("likeCount", { where: { id: recipeId } });
    }
    res.json({
      success: true,
      unliked: !!deleted,
      message: deleted ? "Recipe unliked." : "No like found.",
    });
  } catch (err) {
    console.error("❌ Unlike error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET: public — no auth required
router.get("/", async (req, res) => {
  const { recipeId } = req.query;
  if (!recipeId) {
    return res.status(400).json({ error: 'recipeId required' })
  }
  try {
    const likes = await Like.findAll({ where: { recipeId } });
    res.json(likes);
  } catch (err) {
    console.error("❌ Get likes error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;