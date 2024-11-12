'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.Users, { foreignKey: 'userID' });
      Cart.belongsTo(models.Menu_Items, { foreignKey: 'itemID' });
    }
  }
  Cart.init({
    userID: DataTypes.INTEGER,
    itemID: DataTypes.INTEGER,
    quatity: DataTypes.INTEGER,
    priceTotal: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  });
  return Cart;
};