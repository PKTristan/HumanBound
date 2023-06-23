'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PrevBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PrevBook.belongsTo(models.Circle, { foreignKey: 'circleId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      PrevBook.belongsTo(models.Book, { foreignKey: 'bookId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  PrevBook.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    circleId: {
      allowNull: false,
      type: sequelize.INTEGER,
      references: {
        model: 'Circles',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
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
    modelName: 'PrevBook',
  });
  return PrevBook;
};
