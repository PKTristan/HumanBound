'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // schema in options
};

options.tableName = 'Users';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        username: 'johndoe',
        password: bcrypt.hashSync('password123'),
        avi: 'https://www.shutterstock.com/image-vector/avi-file-format-document-line-260nw-2269662377.jpg',
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@example.com',
        username: 'janesmith',
        password: bcrypt.hashSync('password456'),
        avi: 'https://www.shutterstock.com/image-vector/avi-file-format-document-line-260nw-2269662377.jpg',
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add more user seed data as needed
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
