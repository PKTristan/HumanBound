'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Book, { foreignKey: 'bookId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Review.belongsTo(models.User, { foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Review.hasMany(models.Reply, { foreignKey: 'reviewId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  Review.init({
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
    userId: {
      allowNull: false,
      type: sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    review: {
      allowNull: false,
      type: sequelize.TEXT,
      validate: {
        len: [10, 2000]
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
    modelName: 'Review',
  });
  return Review;
};
