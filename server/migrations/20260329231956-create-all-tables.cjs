'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username:  { type: Sequelize.STRING, allowNull: false, unique: true },
      email:     { type: Sequelize.STRING, allowNull: false, unique: true },
      password:  { type: Sequelize.STRING, allowNull: false },
      banned:    { type: Sequelize.BOOLEAN, defaultValue: false },
      flagged:   { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    })

    await queryInterface.createTable('Recipes', {
      id:           { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title:        { type: Sequelize.STRING, allowNull: false },
      ingredients:  { type: Sequelize.TEXT, allowNull: false },
      instructions: { type: Sequelize.TEXT, allowNull: false },
      likeCount:    { type: Sequelize.INTEGER, defaultValue: 0 },
      approved:     { type: Sequelize.BOOLEAN, defaultValue: false },
      imageUrl:     { type: Sequelize.STRING, allowNull: true },
      userId:       { type: Sequelize.INTEGER, allowNull: false },
      createdAt:    { type: Sequelize.DATE },
      updatedAt:    { type: Sequelize.DATE }
    })

    await queryInterface.createTable('Likes', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId:    { type: Sequelize.INTEGER, allowNull: false },
      recipeId:  { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    })
    await queryInterface.addIndex('Likes', ['userId', 'recipeId'], { unique: true })

    await queryInterface.createTable('Comments', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId:    { type: Sequelize.INTEGER, allowNull: false },
      recipeId:  { type: Sequelize.INTEGER, allowNull: false },
      content:   { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    })

    await queryInterface.createTable('Messages', {
      id:         { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      senderId:   { type: Sequelize.INTEGER, allowNull: false },
      receiverId: { type: Sequelize.INTEGER, allowNull: false },
      content:    { type: Sequelize.TEXT, allowNull: false },
      read:       { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt:  { type: Sequelize.DATE },
      updatedAt:  { type: Sequelize.DATE }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Messages')
    await queryInterface.dropTable('Comments')
    await queryInterface.dropTable('Likes')
    await queryInterface.dropTable('Recipes')
    await queryInterface.dropTable('Users')
  }
}
