'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Users, { as: 'User', foreignKey: 'userID' });
      Review.belongsTo(models.Menu_Items, { foreignKey: 'itemID', as: 'reviews' });
    }
  }
  Review.init({
    userID: DataTypes.INTEGER,
    itemID: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Review',
    freezeTableName: true,
    timestamps: true,
    updatedAt: false
  });
  return Review;
};