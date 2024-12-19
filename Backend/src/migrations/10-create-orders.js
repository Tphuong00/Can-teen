'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Tên bảng liên kết (bảng Users)
          key: 'id' // Khóa chính của bảng Users
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customerInfo:{
        type: Sequelize.TEXT,
      },
      pricetotal: {
        type: Sequelize.DECIMAL
      },
      orderStatus: {
        type: Sequelize.STRING
      },
      deliveryMethod: {
        type: Sequelize.STRING
      },
      promoCode: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Promotion', // Tên bảng liên kết
          key: 'id' // Khóa chính của bảng Promotions
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      paymentID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Payment_Methods', // Tên bảng liên kết
          key: 'id' // Khóa chính của bảng Payment_Methods
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};