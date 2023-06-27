'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Members', [
      {
        userId: 1,
        circleId: 1,
        status: 'host',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        circleId: 2,
        status: 'host',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        circleId: 3,
        status: 'host',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Members', null, options);
  }
};
