// utils/moderate.js
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const HF_API_URL = 'https://api-inference.huggingface.co/models/unitary/toxic-bert'

export async function isToxic(text) {
  console.log('📩 Incoming content for moderation:', text)

  if (!text || typeof text !== 'string') {
    console.log('⚠️ No valid text provided.')
    return false
  }

  try {
    console.log('🌐 Sending request to Hugging Face...')
    const response = await axios.post(
      HF_API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    )

    console.log('✅ HF API call succeeded.')
    const predictions = response.data?.[0] || []
    console.log('📦 Raw prediction array:', predictions)

    const toxic = predictions.find(i => i.label.toLowerCase() === 'toxicity')
    console.log('🤖 Extracted verdict:', toxic?.label, toxic?.score)

    const isToxic = toxic?.score > 0.7
    console.log(`🧠 Final decision: ${isToxic ? '🚫 BLOCKED' : '✅ ALLOWED'}`)

    return isToxic
  } catch (err) {
    console.error('🛑 Hugging Face API failed:', err.message)
    return false
  }
}
