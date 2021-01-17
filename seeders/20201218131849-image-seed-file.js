
'use strict';

const { v4: uuidv4 } = require('uuid')
const db = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Images',
      Array.from({ length: 3 }).map((item, index) =>
        ({
          imageId: uuidv4(),
          url: `upload/article_image/test${index + 1}.jpg`,
          show: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Images', null, {});
  }
};
