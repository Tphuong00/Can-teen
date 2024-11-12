'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cart', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Thay thế bằng tên bảng chính xác
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'   
      },
      itemID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Menu_Items', // Thay thế bằng tên bảng chính xác
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' 
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      priceTotal: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cart');
  }
};