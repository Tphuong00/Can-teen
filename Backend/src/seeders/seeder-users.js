'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users',[{
        userName:'phuongcute',
        fullName:'Thanh Phuong',
        email:'tphuong@gmail.com',
        password:'123456',
        phoneNumber:'0956842352',
        address:'TP HCM',
        roleID: 1
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
