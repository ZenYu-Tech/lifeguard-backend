'use strict';
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    imageId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    url: DataTypes.TEXT,
    show: DataTypes.BOOLEAN,
  }, {});
  Image.associate = function (models) {
    // associations can be defined here
    Image.belongsToMany(models.Article, {
      as: 'articles',
      through: { model: models.ArticleImage },
      foreignKey: 'imageId',
      otherKey: 'articleId'
    })
    Image.hasMany(models.ArticleImage, { foreignKey: 'ImageId', sourceKey: 'imageId' })
  };
  return Image;
};


