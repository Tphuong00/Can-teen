'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Orders);
      Users.hasMany(models.Review);
      Users.hasOne(models.Cart);
      Users.hasMany(models.Notifications);
    }
  }
  Users.init({
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    roleID: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};