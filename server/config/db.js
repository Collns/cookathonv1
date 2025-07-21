import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('cookathon', 'postgresr', 'tested', {
  host: 'localhost',
  dialect: 'postgres',
})

export default sequelize
