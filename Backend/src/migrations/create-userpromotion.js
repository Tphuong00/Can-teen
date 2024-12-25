'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserPromotions', {
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
      promoID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Promotion', // Thay thế bằng tên bảng chính xác
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserPromotions');
  }
};