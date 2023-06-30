'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

options.tableName = 'Approvals';

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
       bookId: 1,
       title: 'Book Title 1',
       subtitle: 'Book Subtitle 1',
       authors: 'Author 1',
       pdfLink: 'https://example.com/book1.pdf',
       thumbnail: 'https://example.com/book1-thumbnail.jpg',
       pageCount: '200',
       publishYear: '2020',
       synopsis: 'This is the synopsis of Book 1.',
       status: 'approved',
       reason: 'This book has received positive reviews.',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
       bookId: 2,
       title: 'Book Title 2',
       subtitle: 'Book Subtitle 2',
       authors: 'Author 2',
       pdfLink: 'https://example.com/book2.pdf',
       thumbnail: 'https://example.com/book2-thumbnail.jpg',
       pageCount: '300',
       publishYear: '2019',
       synopsis: 'This is the synopsis of Book 2.',
       status: 'approved',
       reason: 'This book is highly recommended.',
       createdAt: new Date(),
       updatedAt: new Date()
     },
     {
       bookId: 3,
       title: 'Book Title 3',
       subtitle: 'Book Subtitle 3',
       authors: 'Author 3',
       pdfLink: 'https://example.com/book3.pdf',
       thumbnail: 'https://example.com/book3-thumbnail.jpg',
       pageCount: '250',
       publishYear: '2021',
       synopsis: 'This is the synopsis of Book 3.',
       status: 'pending',
       reason: 'This book is under review.',
       createdAt: new Date(),
       updatedAt: new Date()
     }
   ], {});
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
