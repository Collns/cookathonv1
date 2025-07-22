import express from 'express'
import Message from '../models/Message.js'

const router = express.Router()

// POST: Send a message
router.post('/', async (req, res) => {
  const { senderId, receiverId, content } = req.body
  try {
    const message = await Message.create({ senderId, receiverId, content })
    res.status(201).json(message)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET: Fetch all messages (optionally filter by user)
router.get('/', async (req, res) => {
  const { userId } = req.query
  try {
    const messages = userId
      ? await Message.findAll({
          where: {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }]
          }
        })
      : await Message.findAll()
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
