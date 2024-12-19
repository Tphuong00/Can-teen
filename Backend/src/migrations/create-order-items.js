'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order_Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders', // Tên bảng liên kết
          key: 'id' // Khóa chính của bảng Orders
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },    
      itemID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Menu_Items', // Tên bảng liên kết
          key: 'id' // Khóa chính của bảng Menu_Items
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order_Items');
  }
};