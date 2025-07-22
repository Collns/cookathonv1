import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // AI will set this to true if approved
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
{
  timestamps: true,
  tableName: 'Recipes'
});

export default Recipe;
