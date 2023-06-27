'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Circle, { foreignKey: 'circleId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Message.belongsTo(models.User, { foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  Message.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    circleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Circles',
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
    message: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        len: [1, Infinity]
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
    modelName: 'Message',
  });
  return Message;
};
