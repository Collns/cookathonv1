import express from 'express'
import Message from '../models/Message.js'
import { Op } from 'sequelize'
import auth from '../middleware/auth.js'

const router = express.Router()

// POST: auth required
router.post('/', auth, async (req, res) => {
  const { receiverId, content } = req.body
  const senderId = req.user.id // ✅ S1-07: read from token not body
  try {
    const message = await Message.create({ senderId, receiverId, content })
    res.status(201).json(message)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET: auth required
router.get('/:receiverId', auth, async (req, res) => {
  const { receiverId } = req.params
  const userId = req.user.id // ✅ S1-07: read from token not body
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router