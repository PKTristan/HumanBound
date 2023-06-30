'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

options.tableName = 'Circles';

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
    await queryInterface.bulkInsert(options, [
      {
        creator: 1,
        currentBook: 1,
        name: 'StarGazers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        creator: 2,
        currentBook: 2,
        name: 'Porch Buddies',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        creator: 1,
        currentBook: 3,
        name: 'CATT',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, null, {});
  }
};
