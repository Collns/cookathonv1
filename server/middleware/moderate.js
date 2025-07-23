import axios from 'axios'
import https from 'https'
import User from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()

const HF_API_URL = 'https://api-inference.huggingface.co/models/unitary/toxic-bert'
const MAX_RETRIES = 2

// Create a persistent agent to keep connections alive
const agent = new https.Agent({
  keepAlive: true,
})

async function callHuggingFace(content, retries = MAX_RETRIES) {
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        timeout: 5000,      // Timeout after 5 seconds
        httpsAgent: agent,  // Enable keep-alive
      }
    )

    console.log(`✅ HF call successful.`)
    return response.data?.[0]
  } catch (err) {
    if (retries > 0) {
      console.warn(`🔁 Retry ${MAX_RETRIES - retries + 1}...`)
      return await callHuggingFace(content, retries - 1)
    }

    throw err
  }
}

export async function moderateComment(req, res, next) {
  const { content, userId } = req.body
  console.log('🧪 Incoming content:', content)

  if (!content || !userId) {
    return res.status(400).json({ error: 'Missing comment or user ID' })
  }

  try {
    console.log('🌐 Sending to Hugging Face...')
    const predictions = await callHuggingFace(content)
    console.log('📦 Predictions:', predictions)

    const toxic = predictions.find(i => i.label.toLowerCase() === 'toxic')
    console.log('🤖 Verdict:', toxic?.label, toxic?.score)

    if (toxic?.score > 0.7) {
      console.log('🚫 BLOCKED — toxic score high:', toxic.score)

      const user = await User.findByPk(userId)
      if (user) {
        user.flagged = true
        await user.save()
      }

      return res.status(403).json({
        error: 'Comment flagged as toxic. User has been flagged.',
      })
    }

    console.log('✅ ALLOWED — passed moderation')
    next()
  } catch (err) {
    console.error('🛑 Hugging Face API failed:', err.message)
    return res.status(503).json({ error: 'Moderation service unavailable' })
  }
}
