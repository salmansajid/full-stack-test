'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Coordinates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Coordinates.belongsTo(models.Vehicle, {
        foreignKey: 'vehicleId'
      });
    };
  };
  Coordinates.init({
    latitude: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Latitude is required' } }
    },
    longitude: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Latitude is required' } }
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notEmpty: { msg: 'vehicle cannot be empty' } }
    },
  },{
      sequelize,
      paranoid: true,
      modelName: 'Coordinates',
    }); return Coordinates;
  };
   