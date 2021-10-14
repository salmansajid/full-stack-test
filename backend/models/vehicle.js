'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const config = require('../config');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here_
    };
  };
  Vehicle.init({
    num: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Please enter vehicle num' } }
    },
    notes: DataTypes.STRING,
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Vehicle',
  });

  return Vehicle;
};
