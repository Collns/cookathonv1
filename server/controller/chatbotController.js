import { askAI } from '../utils/aiHelper.js'

export const chatWithAI = async (req, res) => {
  const { message } = req.body

  if (!message) return res.status(400).json({ error: 'Message is required' })

  try {
    const reply = await askAI(message)
    res.json({ reply })
  } catch (err) {
    console.error('❌ AI Error:', err.message)
    res.status(500).json({ error: 'AI response failed' })
  }
}
