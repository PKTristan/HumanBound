'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;    // define schema in options object
};

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
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
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      review: {
        allowNull: false,
        type: Sequelize.TEXT,
        validate: {
          len: [10, Infinity]
        }
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
    await queryInterface.dropTable('Reviews', options);
  }
};
