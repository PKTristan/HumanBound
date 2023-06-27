'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Circle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Circle.belongsTo(models.User, { foreignKey: 'creatorId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Circle.belongsTo(models.Book, { foreignKey: 'currentBook', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Circle.belongsToMany(models.User, { through: 'Member', foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Circle.hasMany(models.Message, { foreignKey: 'circleId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Circle.hasMany(models.PrevBook, { foreignKey: 'circleId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  Circle.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    creator: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    currentBook: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 50]
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
    modelName: 'Circle',
  });
  return Circle;
};
