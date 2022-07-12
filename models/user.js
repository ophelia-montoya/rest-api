'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
// const sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    }, 
    emailAddress: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    }

  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: { 
        fieldName: 'userId',
        allowNull: false,
    },
  });
};

  return User;

};