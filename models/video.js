'use strict';
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    videoId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    title: DataTypes.TEXT,
    embed: DataTypes.TEXT,
    sort: DataTypes.INTEGER,
    show: DataTypes.BOOLEAN,
  }, {});
  Video.associate = function (models) {
    // associations can be defined here
  };
  return Video;
};