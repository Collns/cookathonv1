import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import sequelize from './config/db.js'
import recipeRoutes from './routes/recipeRoutes.js'


const app = express()
app.use(cors())
app.use(express.json())

sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected')
    return sequelize.sync()
  })
  .then(() => console.log('✅ Models synced'))
  .catch(err => console.error('❌ DB connection error:', err.message))

app.use('/api/recipes', recipeRoutes)

app.get('/', (req, res) => res.send('✅ API is running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
