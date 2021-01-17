'use strict';
const { v4: uuidv4 } = require('uuid')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Videos',
      Array.from({ length: 50 }).map((item, index) =>
        ({
          videoId: uuidv4(),
          title: '跳水教學',
          embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/aDZN-mJx-xY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
          imageUrl: 'upload/video_image/test.jpg',
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
