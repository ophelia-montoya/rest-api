'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course title is required'
        },
        notEmpty: {
          msg: 'Please provide a course title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course description is required'
        },
        notEmpty: {
          msg: 'Please provide a course description'
        }
      },
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    },




  }, { sequelize, 
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
   });


  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'administrator',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};