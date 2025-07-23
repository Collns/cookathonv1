// utils/recommend.js
import axios from 'axios'
import Recipe from '../models/Recipe.js'
import dotenv from 'dotenv'
dotenv.config()

export const recommendRecipesAI = async (ingredientString) => {
  const ingredients = ingredientString
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => i.length > 0)

  const allRecipes = await Recipe.findAll()

  // Build a plain list of recipes for the AI to scan
  const recipeList = allRecipes.map(
    r => `• ${r.title}: ${r.ingredients.replace(/\n/g, ' ')}`
  ).join('\n')

  const prompt = `
You are a smart cooking assistant.
The user has these ingredients: ${ingredients.join(', ')}.

From the recipe list below, pick the best 3 recipes that match the ingredients.
Only reply with the **recipe titles** (no explanations).

Recipe List:
${recipeList}
`

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    )

    const reply = response.data[0]?.generated_text || ''
    const aiTitles = reply
      .split('\n')
      .map(t => t.replace(/^[-•\d.]*\s*/, '').trim())
      .filter(Boolean)

    // Match titles back to real recipes
    const recommended = allRecipes.filter(r =>
      aiTitles.includes(r.title)
    )

    return recommended
  } catch (err) {
    console.error('🛑 AI recipe recommend failed:', err.message)
    return []
  }
}
