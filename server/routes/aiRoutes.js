import express from "express";
import { Op } from "sequelize";
import Recipe from "../models/Recipe.js";
import { recommendRecipesAI } from "../utils/recommend.js";
import { formatInstructionsAI, generateTitleAI } from "../utils/formatter.js";
import { askAI } from "../utils/aiHelper.js";

const router = express.Router();

/**
 * POST /api/ai/recommend
 * Recommends recipes based on user's available ingredients
 * First checks DB for matches, falls back to DeepSeek AI if none found
 * Frontend sends: { ingredients: "eggs, flour, sugar" }
 */
router.post("/recommend", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).json({ error: "Ingredients required" });

  try {
    // Check DB first — faster and cheaper than an AI call
    const dbMatches = await Recipe.findAll({
      where: { 
        ingredients: { 
          [Op.iLike]: { 
            [Op.any]: ingredients.split(",").map(ing => `%${ing.trim()}%`)
          } 
        } 
      },
      order: [["createdAt", "DESC"]],
    });

    if (dbMatches.length > 0) {
      return res.json({
        source: "database",
        suggestions: dbMatches.map((r) => r.toJSON()),
      });
    }

    // No DB matches — fall back to DeepSeek AI
    const aiSuggestions = await recommendRecipesAI(ingredients);

    if (!aiSuggestions || aiSuggestions.length === 0) {
      return res.json({
        source: "ai",
        suggestions: [
          {
            title: "No recipe found",
            ingredients,
            instructions: "Sous Chef could not generate a recipe for these ingredients yet.",
          },
        ],
      });
    }

    res.json({
      source: "ai",
      suggestions: aiSuggestions,
    });
  } catch (err) {
    console.error("❌ Recommend failed:", err.message);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

/**
 * POST /api/ai/title
 * Generates a recipe title from ingredients using DeepSeek AI
 * Frontend sends: { ingredients: "chicken, lemon, garlic" }
 * S1-12 fix: was reading req.body.text, now matches frontend's { ingredients }
 */
router.post("/title", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).json({ error: "Missing ingredients" });

  try {
    const title = await generateTitleAI(ingredients);
    res.json({ title });
  } catch (err) {
    console.error("❌ Title generation failed:", err.message);
    res.status(500).json({ error: "Title generation failed" });
  }
});

/**
 * POST /api/ai/format
 * Cleans up messy cooking instructions into numbered steps using DeepSeek AI
 * Frontend sends: { instructions: "boil water add pasta drain" }
 * S1-12 fix: was reading req.body.text, now matches frontend's { instructions }
 */
router.post("/format", async (req, res) => {
  const { instructions } = req.body;
  if (!instructions) return res.status(400).json({ error: "Missing instructions" });

  try {
    const formatted = await formatInstructionsAI(instructions);
    res.json({ formatted });
  } catch (err) {
    console.error("❌ Format failed:", err.message);
    res.status(500).json({ error: "Format failed" });
  }
});

/**
 * POST /api/ai/chat
 * General cooking Q&A chatbot powered by DeepSeek AI
 * Frontend sends: { message: "How long should I boil eggs?" }
 */
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const reply = await askAI(message);
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat AI failed:", err.message);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;