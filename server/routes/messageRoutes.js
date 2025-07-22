import express from 'express'
import Message from '../models/Message.js'
import { Op } from 'sequelize';

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
router.get('/:receiverId', async (req, res) => {
  const { receiverId } = req.params;
  const { userId } = req.query;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router
