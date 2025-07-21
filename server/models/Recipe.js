import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING), // or TEXT and use comma-separated
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
})

export default Recipe
