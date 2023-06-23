'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.hasMany(models.Approval, { foreignKey: 'bookId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Book.belongsToMany(models.Circle, { foreignKey: 'currentBook', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Book.hasMany(models.PrevBook, { foreignKey: 'bookId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Book.hasMany(models.Review, { foreignKey: 'bookId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  Book.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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
      type: sequelize.INTEGER,
    },
    publishYear: {
      allowNull: true,
      type: sequelize.INTEGER,
    },
    synopsis: {
      allowNull: false,
      type: sequelize.TEXT,
      validate: {
        len: [20, 2000]
      }
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
    modelName: 'Book',
  });
  return Book;
};
