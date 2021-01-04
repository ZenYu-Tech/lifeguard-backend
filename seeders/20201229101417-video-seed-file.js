'use strict';
const { v4: uuidv4 } = require('uuid')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Videos',
      Array.from({ length: 50 }).map((item, index) =>
        ({
          videoId: uuidv4(),
          title: '跳水教學',
          videoUrl: 'https://www.youtube.com/',
          imageUrl: 'upload/article_image/test.jpg',
          sort: index + 1,
          show: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Videos', null, {});
  }
};
