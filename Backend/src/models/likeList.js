'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikeLists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LikeLists.belongsTo(models.Users, { foreignKey: 'userID' });
      LikeLists.belongsTo(models.Menu_Items, { foreignKey: 'itemID', as: 'item' })
    }
  }
  LikeLists.init({
      userID: DataTypes.INTEGER,
      itemID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'LikeLists',
    timestamps: true,
    updatedAt: false,
  });
  return LikeLists;
};