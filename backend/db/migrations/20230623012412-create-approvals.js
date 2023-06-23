'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;    // define schema in options object
};

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Approvals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Books',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      subtitle: {
        allowNull: true,
        type: Sequelize.STRING
      },
      authors: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pdfLink: {
        allowNull: true,
        type: Sequelize.STRING
      },
      thumbnail: {
        allowNull: true,
        type: Sequelize.STRING
      },
      pageCount: {
        allowNull:true,
        type: Sequelize.INTEGER
      },
      publishYear: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      synopsis: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('pending', 'approved', 'rejected')
      },
      reason: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, options)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Approvals', options);
  }
};
