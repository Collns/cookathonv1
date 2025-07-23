import axios from 'axios'
import Recipe from '../models/Recipe.js'
import dotenv from 'dotenv'
dotenv.config()

const HF_HEADERS = {
  Authorization: `Bearer ${process.env.HF_API_KEY}`,
}
const HF_URL = 'https://api-inference.huggingface.co/models/gpt2'


/** 
 * AI: Formats recipe instructions clearly
 */
export async function formatInstructionsAI(text) {
  try {
    const response = await axios.post(
      HF_URL,
      {
        inputs: `Format this recipe step-by-step with clear spacing:\n\n${text}`,
        options: { wait_for_model: true },
      },
      { headers: HF_HEADERS }
    )
    return response.data?.[0]?.generated_text.trim() || text
  } catch (err) {
    console.error('❌ AI formatting failed:', err.message)
    return text
  }
}

/**
 * AI: Generates a catchy recipe title from ingredients or instructions
 */
export async function generateTitleAI(rawText) {
  try {
    const response = await axios.post(
      HF_URL,
      {
        inputs: `Create a short, catchy cooking recipe title from this:\n\n${rawText}`,
        options: { wait_for_model: true },
      },
      { headers: HF_HEADERS }
    )
    return response.data?.[0]?.generated_text.trim() || 'Untitled Recipe'
  } catch (err) {
    console.error('❌ AI title generation failed:', err.message)
    return 'Untitled Recipe'
  }
}


/**
 * AI: Check for duplicate recipes using semantic similarity (basic form)
 */
export async function isDuplicateRecipe(content) {
  try {
    const allRecipes = await Recipe.findAll()
    const lower = content.toLowerCase()

    return allRecipes.some(r => {
      const matchTitle = r.title?.toLowerCase().includes(lower)
      const matchInstructions = r.instructions?.toLowerCase().includes(lower)
      return matchTitle || matchInstructions
    })
  } catch (err) {
    console.error('❌ Duplicate check failed:', err.message)
    return false
  }
}
