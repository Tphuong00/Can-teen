'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notifications.belongsTo(models.Users, { foreignKey: 'userID' });

    }
  }
  Notifications.init({
    userID: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    is_read: DataTypes.BOOLEAN,
    createAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notifications',
  });
  return Notifications;
};