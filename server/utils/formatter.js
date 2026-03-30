/**
 * utils/formatter.js — DeepSeek AI utilities for recipe processing
 * 
 * formatInstructionsAI() — cleans messy instructions into numbered steps
 * generateTitleAI() — creates a catchy title from ingredients/instructions
 * isDuplicateRecipe() — checks DB for similar existing recipes
 * 
 * S1-13: Added 8s timeout to all DeepSeek calls to prevent hanging
 * S1-13: Fixed isDuplicateRecipe to limit DB query and improve matching
 */
import axios from 'axios'
import Recipe from '../models/Recipe.js'
import dotenv from 'dotenv'
dotenv.config()

const deepseekURL = 'https://api.deepseek.com/v1/chat/completions'
const deepseekHeaders = {
  'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  'Content-Type': 'application/json'
}

/**
 * Formats messy cooking instructions into clean numbered steps
 * Falls back to original text if DeepSeek fails or times out
 */
export async function formatInstructionsAI(text) {
  try {
    const response = await axios.post(
      deepseekURL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful chef. When given unclear or messy cooking instructions, return a clean, numbered, step-by-step recipe with clear punctuation.'
          },
          {
            role: 'user',
            content: `Please format this recipe properly:\n\n${text}`
          }
        ],
        max_tokens: 150,
        temperature: 0.6
      },
      { headers: deepseekHeaders, timeout: 8000 }  // S1-13: 8s timeout
    )

    const aiResponse = response.data.choices?.[0]?.message?.content?.trim()
    return aiResponse || text
  } catch (err) {
    console.error('❌ SousChef formatting error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    })
    return text  // graceful fallback — return original text
  }
}

/**
 * Generates a catchy recipe title from ingredients or instructions
 * Falls back to "Untitled Recipe" if DeepSeek fails or times out
 */
export async function generateTitleAI(rawText) {
  try {
    const response = await axios.post(deepseekURL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a cooking assistant that writes short catchy recipe titles.' },
        { role: 'user', content: `Create a short, catchy cooking recipe title from this:\n\n${rawText}` }
      ],
      max_tokens: 30,
      temperature: 0.7
    }, { headers: deepseekHeaders, timeout: 8000 })  // S1-13: 8s timeout

    return response.data.choices[0]?.message?.content.trim() || 'Untitled Recipe'
  } catch (err) {
    console.error('❌ DeepSeek title gen error:', err.message)
    return 'Untitled Recipe'  // graceful fallback
  }
}

/**
 * Checks if a similar recipe already exists in the DB
 * S1-13 fix: limited query to 500 recipes with only title field
 * S1-13 fix: checks if 3+ words from new title appear in existing titles
 * instead of checking if entire content string is a substring (old logic was inverted)
 */
export async function isDuplicateRecipe(content) {
  try {
    const allRecipes = await Recipe.findAll({
      limit: 500,
      attributes: ['title']  // only fetch what we need
    })

    // Split the new content into words, filter out short ones
    const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 3)

    // Check if 3+ meaningful words from the new recipe match an existing title
    return allRecipes.some(r => {
      const existingTitle = r.title?.toLowerCase() || ''
      const matchCount = words.filter(w => existingTitle.includes(w)).length
      return matchCount >= 3
    })
  } catch (err) {
    console.error('❌ Duplicate check error:', err.message)
    return false  // on error, allow the recipe through
  }
}