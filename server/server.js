
import sequelize from './config/db.js'

sequelize.authenticate()
  .then(() => console.log('🟢 PostgreSQL connected'))
  .catch(err => console.error('🔴 DB connection error:', err))
