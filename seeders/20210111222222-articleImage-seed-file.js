
'use strict';

const { v4: uuidv4 } = require('uuid')
const db = require('../models')
const { Article, Image } = db

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let articleIdArray = []
    let imageIdArray = []

    const images = await Image.findAll()

    const articles = await Article.findAll({ where: { category: 'experience' } })

    articles.forEach(a => [
      articleIdArray.push(a.articleId)
    ])

    images.forEach(a => [
      imageIdArray.push(a.imageId)
    ])

    return queryInterface.bulkInsert('ArticleImages',
      Array.from({ length: articles.length }).map((item, index) =>
      ({
        articleImageId: uuidv4(),
        ArticleId: articleIdArray[index],
        ImageId: imageIdArray[Math.floor(Math.random() * imageIdArray.length)],
        mainImage: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ArticleImages', null, {});
  }
};
