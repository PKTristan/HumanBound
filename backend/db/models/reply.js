'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reply.belongsTo(models.Review, { foreignKey: 'reviewId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Reply.belongsTo(models.User, { foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  Reply.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    reviewId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Reviews',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    reply: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        len: [10, Infinity]
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
    modelName: 'Reply',
  });
  return Reply;
};
