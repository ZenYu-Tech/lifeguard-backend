'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    fileId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    category: DataTypes.STRING,
    title: DataTypes.TEXT,
    url: DataTypes.TEXT,
    sort: DataTypes.INTEGER,
    show: DataTypes.BOOLEAN
  }, {});
  File.associate = function (models) {
    // associations can be defined here
  };
  return File;
};