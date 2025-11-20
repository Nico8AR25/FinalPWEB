'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stream extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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

