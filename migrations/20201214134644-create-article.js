'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Articles', {
      articleId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      category: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.TEXT
      },
      content: {
        type: Sequelize.TEXT('long')
      },
      sort: {
        type: Sequelize.INTEGER,
      },
      show: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('articles');
  }
};