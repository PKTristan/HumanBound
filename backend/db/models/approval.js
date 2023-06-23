'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Approval extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Approval.belongsTo(models.Book, {foreignKey: 'bookId', onUpdate: 'CASCADE', onDelete: 'CASCADE'});
    }
  }
  Approval.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bookId: {
      allowNull: false,
      type: sequelize.INTEGER,
      references: {
        model: 'Books',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    title: {
      allowNull: false,
      type: sequelize.STRING,
      validate: {
        len: [1, 30]
      }
    },
    subtitle: {
      allowNull: true,
      type: sequelize.STRING,
    },
    authors: {
      allowNull: false,
      type: sequelize.STRING,
      validate: {
        len: [1, 100]
      }
    },
    pdfLink: {
      allowNull: true,
      type: sequelize.STRING,
    },
    thumbnail: {
      allowNull: true,
      type: sequelize.STRING,
    },
    pageCount: {
      allowNull: true,
      type: sequelize.STRING,
    },
    publishYear: {
      allowNull: true,
      type: sequelize.STRING,
    },
    synopsis: {
      allowNull: false,
      type: sequelize.TEXT,
      validate: {
        len: [20, 2000]
      }
    },
    status: {
      allowNull: false,
      type: sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    reason: {
      allowNull: false,
      type: sequelize.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Approval',
  });
  return Approval;
};
