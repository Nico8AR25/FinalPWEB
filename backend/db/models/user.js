'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.stream, { 
        foreignKey: 'streamerId',
        as: 'streams'
      });
      user.hasMany(models.donacion, { 
        foreignKey: 'userId',
        as: 'donacionesEnviadas'
      });
      user.hasMany(models.donacion, { 
        foreignKey: 'streamerId',
        as: 'donacionesRecibidas'
      });
    };
  }
  user.init({
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    tipoUsuario: DataTypes.STRING,
    saldo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};



