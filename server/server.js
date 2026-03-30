import dotenv from 'dotenv'
dotenv.config()
import './models/index.js'
import express from 'express'
import cors from 'cors'
import timeout from 'connect-timeout'
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

/**
 * S1-09: Global 30-second request timeout
 * If any request (especially AI calls to DeepSeek/HuggingFace) hangs,
 * this kills it after 30 seconds instead of blocking indefinitely
 * Individual AI call timeouts (S1-13) are shorter — this is the backstop
 */
app.use(timeout('30s'))

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

/**
 * S1-09: Timeout check — drops timed-out requests before they hit the error handler
 * Without this, a timed-out request continues through middleware and may crash
 */
app.use((req, res, next) => {
  if (!req.timedout) next()
})

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