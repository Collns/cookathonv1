import dotenv from 'dotenv'
dotenv.config()

/**
 * S1-04: Startup environment guard
 * Checks that all required env vars are set before the server boots
 * Prevents silent failures from missing API keys or DB credentials
 * If any are missing, logs which ones and exits immediately
 */
const REQUIRED_ENV = ['JWT_SECRET', 'DATABASE_URL', 'DEEPSEEK_API_KEY', 'HF_API_KEY']
const missing = REQUIRED_ENV.filter(key => !process.env[key])
if (missing.length) {
  console.error('❌ Missing required environment variables:', missing.join(', '))
  console.error('   Copy .env.example to .env and fill in all values')
  process.exit(1)
}

import './models/index.js'
import express from 'express'
import cors from 'cors'
import sequelize from './config/db.js'
import recipeRoutes from './routes/recipeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import chatbotRoutes from './routes/chatbotRoutes.js'
import authRoutes from './routes/authRoutes.js';
import rateLimiter from './middleware/rateLimiter.js'
import logger from './middleware/logger.js'
import errorHandler from './middleware/errorHandler.js'
import bodySanitizer from './middleware/bodySanitizer.js'
import auth from './middleware/auth.js'
import { validateRecipe } from './middleware/validator.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(logger)
app.use(bodySanitizer)
app.use('/api/auth', authRoutes);
app.use(rateLimiter)
// app.use(auth)


app.use('/api/recipes', recipeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use(errorHandler)

app.get('/', (req, res) => res.send('✅ API is running'))

const PORT = process.env.PORT || 5000

// ✅ S1-01: app.listen() fires only after DB is confirmed ready
// ✅ S1-02: sequelize.sync() removed — migrations handle schema
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected')
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ DB connection error:', err.message)
    process.exit(1)
  })