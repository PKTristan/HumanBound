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
    await queryInterface.bulkInsert('Messages', [
      {
        userId: 1,
        circleId: 1,
        message: 'Hi guys!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        circleId: 2,
        message: 'hi, im your host',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        circleId: 3,
        message: 'hi guys, welcome.',
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
    await queryInterface.bulkDelete('Messages', null, options);
  }
};
