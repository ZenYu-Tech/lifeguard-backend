'use strict';

module.exports = (sequelize, DataTypes) => {
  const ArticleImage = sequelize.define('ArticleImage', {
    articleImageId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    mainImage: DataTypes.BOOLEAN,
    ArticleId: {
      type: DataTypes.UUID,
    },
    ImageId: {
      type: DataTypes.UUID,
    },
  }, {});
  ArticleImage.associate = function (models) {
    ArticleImage.belongsTo(models.Article, { foreignKey: 'articleId', targetKey: 'articleId' })
    ArticleImage.belongsTo(models.Image, { foreignKey: 'imageId', targetKey: 'imageId' })
  };
  return ArticleImage;
};


