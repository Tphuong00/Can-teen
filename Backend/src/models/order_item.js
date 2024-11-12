'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_Items.belongsTo(models.Menu_Items, { foreignKey: 'itemID' });
      Order_Items.belongsTo(models.Orders, { foreignKey: 'orderID' });
    }
  }
  Order_Items.init({
    orderID: DataTypes.INTEGER,
    itemID: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Order_Items',
    timestamps: true,
    updatedAt: false
  });
  return Order_Items;
};