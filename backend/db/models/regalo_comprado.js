'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class regalo_comprado extends Model {
    static associate(models) {
      regalo_comprado.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'usuario'
      });
    }
  }
  regalo_comprado.init({
    userId: DataTypes.INTEGER,
    giftId: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    costo: DataTypes.INTEGER,
    puntos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'regalo_comprado',
    tableName: 'regalos_comprados'
  });
  return regalo_comprado;
};
