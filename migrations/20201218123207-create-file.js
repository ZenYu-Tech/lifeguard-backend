'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Files', {
      fileId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      category: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Files');
  }
};