'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class donacion extends Model {
    static associate(models) {
      donacion.belongsTo(models.user, { 
        foreignKey: 'userId',
        as: 'donador'
      });
      donacion.belongsTo(models.user, { 
        foreignKey: 'streamerId',
        as: 'streamer'
      });
      donacion.belongsTo(models.stream, { 
        foreignKey: 'streamId',
        as: 'stream'
      });
    }
  }
  donacion.init({
    userId: DataTypes.INTEGER,
    streamerId: DataTypes.INTEGER,
    streamId: DataTypes.INTEGER,
    monto: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'donacion',
  });
  return donacion;
};

