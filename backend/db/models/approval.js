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
      type: DataTypes.INTEGER
    },
    bookId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 30]
      }
    },
    subtitle: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    authors: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 100]
      }
    },
    pdfLink: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    thumbnail: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    pageCount: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    publishYear: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    synopsis: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        len: [20, Infinity]
      }
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    reason: {
      allowNull: false,
      type: DataTypes.TEXT
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
