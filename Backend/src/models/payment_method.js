'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment_Methods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment_Methods.hasMany(models.Orders);
    }
  }
  Payment_Methods.init({
    method_type: DataTypes.STRING,
    details: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Payment_Methods',
    timestamps: false,
  });
  return Payment_Methods;
};