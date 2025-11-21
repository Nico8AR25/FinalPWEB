'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stream extends Model {
    static associate(models) {
      stream.belongsTo(models.user, { 
        foreignKey: 'streamerId',
        as: 'streamer'
      });
      stream.hasMany(models.donacion, { 
        foreignKey: 'streamId',
        as: 'donaciones'
      });
    }
  }
  stream.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    streamerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'stream',
  });
  return stream;
};

