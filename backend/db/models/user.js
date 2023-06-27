'use strict';
const {
  Model, Validator
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
      type: DataTypes.INTEGER
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 20],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }

      }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 20]
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [4, 30],
        isEmail: true
      }
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 20]
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING.BINARY,
      validate: {
        len: [60, 60]
      }
    },
    avi: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    admin: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
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
    defaultScope: {
      attributes: {
        exclude: ["password", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};
