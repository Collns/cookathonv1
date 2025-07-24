// Updated utils/formatter.js with DeepSeek
import axios from 'axios'
import Recipe from '../models/Recipe.js'
import dotenv from 'dotenv'
dotenv.config()

const deepseekURL = 'https://api.deepseek.com/v1/chat/completions'
const deepseekHeaders = {
  'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  'Content-Type': 'application/json'
}

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
      { headers: deepseekHeaders }
    )

    const aiResponse = response.data.choices?.[0]?.message?.content?.trim()
    return aiResponse || text
  } catch (err) {
    console.error('❌ DeepSeek formatting error:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    })
    return text
  }
}

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
    }, { headers: deepseekHeaders })

    return response.data.choices[0]?.message?.content.trim() || 'Untitled Recipe'
  } catch (err) {
    console.error('❌ DeepSeek title gen error:', err.message)
    return 'Untitled Recipe'
  }
}

export async function isDuplicateRecipe(content) {
  try {
    const allRecipes = await Recipe.findAll()
    const lower = content.toLowerCase()
    return allRecipes.some(r =>
      r.title?.toLowerCase().includes(lower) ||
      r.instructions?.toLowerCase().includes(lower)
    )
  } catch (err) {
    console.error('❌ Duplicate check error:', err.message)
    return false
  }
}
