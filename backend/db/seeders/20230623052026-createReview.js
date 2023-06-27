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
    await queryInterface.bulkInsert('Reviews', [
      {
        bookId: 1,
        userId: 1,
        review: "A groundbreaking feminist classic that explores the construction of womanhood and the oppressive societal structures. De Beauvoir's thought-provoking analysis challenges traditional gender norms and sheds light on the struggle for women's liberation.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookId: 2,
        userId: 2,
        review: "A groundbreaking exploration of gender and identity. Butler's influential work challenges traditional notions of gender as binary and fixed, offering insightful perspectives on how gender is performed, subverted, and constructed.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        bookId: 3,
        userId: 1,
        review: "A powerful and poignant novel that explores gender identity, oppression, and the struggle for self-acceptance. Feinberg's storytelling captures the complexities of being a butch lesbian in a society that marginalizes and erases queer experiences.",
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
    await queryInterface.bulkDelete('Reviews', null, options);
  }
};
