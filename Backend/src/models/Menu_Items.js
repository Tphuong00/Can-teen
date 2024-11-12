'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu_Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Menu_Items.hasMany(models.Review);
      Menu_Items.hasMany(models.Cart);
      Menu_Items.hasMany(models.Order_Items);
    }
  }
  Menu_Items.init({
    itemName: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    category: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    mealTime: DataTypes.INTEGER,
    availability: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Menu_Items',
  });
  return Menu_Items;
};