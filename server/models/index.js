import sequelize from '../db.js';
import User from './User.js';
import Recipe from './Recipe.js'
import Like from './Like.js';
import Comment from './Comment.js';
import Message from './Message.js';

// 🧾 Recipe relationships
User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

// 👍 Like relationships (many-to-many)
User.belongsToMany(Recipe, { through: Like, foreignKey: 'userId' });
Recipe.belongsToMany(User, { through: Like, foreignKey: 'recipeId' });

// 💬 Comment relationships
User.hasMany(Comment, { foreignKey: 'userId' });
Recipe.hasMany(Comment, { foreignKey: 'recipeId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Recipe, { foreignKey: 'recipeId' });

// 📩 Messaging relationships
User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

export {
  sequelize,
  User,
  Recipe,
  Like,
  Comment,
  Message
};
