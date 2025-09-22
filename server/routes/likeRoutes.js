import express from "express";
import Like from "../models/Like.js";
import Recipe from "../models/Recipe.js";

const router = express.Router();

// POST: Like a recipe
router.post("/", async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    // prevent duplicate likes
    const [like, created] = await Like.findOrCreate({
      where: { userId, recipeId },
    });

    if (created) {
      // increment cached likeCount in Recipe
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

// DELETE: Unlike a recipe
router.delete("/", async (req, res) => {
  const { userId, recipeId } = req.body;

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

// GET: likes for a recipe (or all if no recipeId)
router.get("/", async (req, res) => {
  const { recipeId } = req.query;

  try {
    if (recipeId) {
      const likes = await Like.findAll({ where: { recipeId } });
      return res.json(likes);
    }

    const likes = await Like.findAll();
    res.json(likes);
  } catch (err) {
    console.error("❌ Get likes error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
