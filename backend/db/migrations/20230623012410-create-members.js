'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;    // define schema in options object
};

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      circleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Circles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('pending', 'approved', 'host')
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
    await queryInterface.dropTable('Members', options);

  }
};
