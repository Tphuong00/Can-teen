'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reservations.init({
    fullName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    reservation_time: DataTypes.TIME,
    reservation_date: DataTypes.DATE,
    number_of_people: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    createdAT: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Reservations',
    timestamps: true,
    updatedAt: false,
  });
  return Reservations;
};