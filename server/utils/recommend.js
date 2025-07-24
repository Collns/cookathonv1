// Updated utils/recommend.js with DeepSeek AI
import axios from 'axios'
import Recipe from '../models/Recipe.js'
import dotenv from 'dotenv'
dotenv.config()

const deepseekHeaders = {
  Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  'Content-Type': 'application/json'
}
const deepseekURL = 'https://api.deepseek.com/v1/chat/completions'

export const recommendRecipesAI = async (ingredientString) => {
  const ingredients = ingredientString
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => i.length > 0)

  const allRecipes = await Recipe.findAll()

  const recipeList = allRecipes.map(
    r => `• ${r.title}: ${r.ingredients.replace(/\n/g, ' ')}`
  ).join('\n')

  const prompt = `
You are a cooking assistant.
User has these ingredients: ${ingredients.join(', ')}.

From the recipe list below, pick the 3 best matching recipes.
Only return the recipe titles.

Recipe List:
${recipeList}
`

  try {
    const response = await axios.post(deepseekURL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Only return recipe titles separated by new lines.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.5
    }, { headers: deepseekHeaders })

    const raw = response.data.choices[0]?.message?.content || ''
    const aiTitles = raw
      .split('\n')
      .map(t => t.replace(/^[-\u2022\d.]*\s*/, '').trim())
      .filter(Boolean)

    const recommended = allRecipes.filter(r => aiTitles.includes(r.title))
    return recommended
  } catch (err) {
    console.error('❌ DeepSeek recommendation failed:', err.message)
    return []
  }
}
