import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  indexes: [{ unique: true, fields: ['userId', 'recipeId'] }],
  timestamps: true
});

export default Like;
