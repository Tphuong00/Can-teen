'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPromotions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserPromotions.belongsTo(models.Promotion, { foreignKey: 'promoID' });
      UserPromotions.belongsTo(models.Users, { foreignKey: 'userID' });

    }
  }
  UserPromotions.init({
    userID: DataTypes.INTEGER,
    promoID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserPromotions',
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
  });
  return UserPromotions;
};