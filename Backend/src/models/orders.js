'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Orders.belongsTo(models.Users, { foreignKey: 'userID' });
      Orders.hasMany(models.Order_Items, { foreignKey: 'orderID' });
      Orders.belongsTo(models.Promotion, { foreignKey: 'promoCode', targetKey: 'id' });
      Orders.belongsTo(models.Payment_Methods, { foreignKey: 'paymentID' });

    }
  }
  Orders.init({
    userID: DataTypes.INTEGER,
    customerInfo: DataTypes.TEXT,
    pricetotal: DataTypes.DECIMAL,
    orderStatus: DataTypes.STRING,
    deliveryMethod: DataTypes.STRING,
    promoCode: DataTypes.INTEGER,
    paymentID: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Orders',
    timestamps: true,
    updatedAt: false,
  });
  return Orders;
};