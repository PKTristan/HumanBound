'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

options.tableName = 'Replies';

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
        reviewId: 1,
        userId: 1,
        reply: 'Wow, such a fundamental read for anyone. It really draws a perspective of the past that is essential to understanding our present',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: 2,
        userId: 2,
        reply: 'What a wonderful perspective to read about. truly a heart moving story. balhjvgaluehvlkuahweuihvuaheuirvjnonlkmlkmoijmomlkmoimlk',
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
