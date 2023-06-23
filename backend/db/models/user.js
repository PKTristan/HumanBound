'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Circle, { foreignKey: 'creatorId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      User.belongsToMany(models.Circle, { through: 'Member', foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      User.hasMany(models.Message, { foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      User.hasMany(models.Reply, { foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      User.hasMany(models.Review, { foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      allowNull: false,
      type: sequelize.STRING,
      validate: {
        len: [1, 20]
      }
    },
    lastName: {
      allowNull: false,
      type: sequelize.STRING,
      validate: {
        len: [1, 20]
      }
    },
    email: {
      allowNull: false,
      type: sequelize.STRING,
      unique: true
    },
    username: {
      allowNull: false,
      type: sequelize.STRING,
      validate: {
        len: [1, 20]
      }
    },
    password: {
      allowNull: false,
      type: sequelize.STRING,
      validate: {
        len: [7, 25]
      }
    },
    avi: {
      allowNull: true,
      type: sequelize.STRING,
    },
    admin: {
      allowNull: false,
      type: sequelize.BOOLEAN,
      defaultValue: false
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
    modelName: 'User',
  });
  return User;
};
