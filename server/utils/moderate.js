// Updated utils/moderate.js with DeepSeek AI
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const deepseekHeaders = {
  Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  'Content-Type': 'application/json'
}
const deepseekURL = 'https://api.deepseek.com/v1/chat/completions'

export async function isToxic(text) {
  if (!text || typeof text !== 'string') return false

  const prompt = `Check if this message contains offensive, hateful or toxic language. Respond with just YES or NO.

Text:
${text}`

  try {
    const response = await axios.post(deepseekURL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a strict content moderator. Hwile moderating allow vulgar expressions unless used in an insultive context.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 5,
      temperature: 0.3
    }, { headers: deepseekHeaders })

    const verdict = response.data.choices[0]?.message?.content.trim().toLowerCase()
    return verdict.startsWith('yes')
  } catch (err) {
    console.error('❌ DeepSeek moderation failed:', err.message)
    return false
  }
}
