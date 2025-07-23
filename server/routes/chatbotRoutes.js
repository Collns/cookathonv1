import express from 'express'
import { chatWithAI } from '../controller/chatbotController.js'

const router = express.Router()

router.post('/', chatWithAI)

export default router
