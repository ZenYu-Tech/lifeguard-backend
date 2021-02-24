'use strict';

const { v4: uuidv4 } = require('uuid')

const category = ['experience', 'news']

module.exports = {
  up: async (queryInterface, Sequelize) => {


    return queryInterface.bulkInsert('Articles',
      Array.from({ length: 50 }).map((item, index) => {

        let c = category[Math.floor(Math.random() * category.length)]

        return {
          articleId: uuidv4(),
          category: c,
          mainPoint: c === 'news'
            ? '「亞薩」可能是「亞薩後裔」的略語，指聖殿合唱團之一，或這合唱團的常備曲目。以斯拉記二41記載說，隨同以斯拉回到巴勒斯坦的歌唱者是「亞薩的子孫」'
            : '',
          title: `Text title ${index + 1}`,
          content: `<html>Hello world ${index + 1}</html>`,
          sort: index + 1,
          show: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Articles', null, {});
  }
};
