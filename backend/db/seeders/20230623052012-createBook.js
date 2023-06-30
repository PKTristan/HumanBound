'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

options.tableName = 'Books';

module.exports = {
  async up (queryInterface, Sequelize) {
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
        title: 'The Second Sex',
        authors: 'Simone de Beauvoir',
        subtitle: 'New Edition',
        pdfLink: null,
        thumbnail: 'https://img.thriftbooks.com/api/images/m/9fc5cb2e3ad3725e669d9a78de443a11c1cd16fc.jpg',
        pageCount: 800,
        publishYear: 1949,
        synopsis: 'The Second Sex is a seminal work of feminist philosophy by Simone de Beauvoir. It explores the concept of womanhood and addresses the oppression of women in society.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Stone Butch Blues',
        authors: 'Leslie Feinberg',
        subtitle: '20th Anniversary Edition',
        pdfLink: null,
        thumbnail: 'https://upload.wikimedia.org/wikipedia/en/2/25/Stone_Butch_Blues_cover.jpg',
        pageCount: 400,
        publishYear: 1993,
        synopsis: 'Stone Butch Blues is a groundbreaking novel by Leslie Feinberg. It follows the life of Jess Goldberg, a working-class butch lesbian, as she navigates gender identity, discrimination, and activism.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Feminism Is for Everybody: Passionate Politics',
        authors: 'bell hooks',
        pdfLink: null,
        thumbnail: 'https://books.google.com/books/content?id=0au7QbAJH0gC&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U3gjTPGHoq6dWwR14FebIOhFxv7gw&w=1280',
        pageCount: 200,
        publishYear: 2000,
        synopsis: 'In this accessible and insightful book, bell hooks explores the history, theory, and practice of feminism. She argues that feminism is a movement for social justice that benefits everyone, not just women.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete(options, null, {});
  }
};
