'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promotion.hasMany(models.Orders);
    }
  }
  Promotion.init({
    code: DataTypes.STRING,
    description: DataTypes.STRING,
    discount_precentage: DataTypes.DECIMAL,
    date_from: DataTypes.DATE,
    date_unitl: DataTypes.DATE, 
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Promotion',
    timestamps: true,
    updatedAt: false,
  });
  return Promotion;
};