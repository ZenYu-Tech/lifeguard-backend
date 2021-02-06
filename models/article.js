'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    articleId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    category: DataTypes.TEXT,
    title: DataTypes.TEXT,
    mainPoint: DataTypes.TEXT,
    content: DataTypes.TEXT('long'),
    sort: {
      type: DataTypes.INTEGER,
    },
    show: DataTypes.BOOLEAN
  }, {});
  Article.associate = function (models) {
    // associations can be defined here
    Article.belongsToMany(models.Image, {
      as: 'images',
      through: { model: models.ArticleImage },
      foreignKey: 'articleId',
      otherKey: 'imageId'
    })
    Article.hasMany(models.ArticleImage, { foreignKey: 'ArticleId', sourceKey: 'articleId' })
  };
  return Article;
};