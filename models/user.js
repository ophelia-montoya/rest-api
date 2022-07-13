'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name.'
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'A last name is required'
        }, 
        notEmpty: {
          msg: "Please provide a last name"
        }
      }
    }, 
    emailAddress: { // Adds validation to email
      type: DataTypes.STRING,
      allowNull: false,
      unique: { // ...to ensure email isn't already associated with existing user...
        msg: 'The email you entered already exists'
      },
      validate: {
        notNull: {
          msg: 'An email address is required'
        },
        isEmail: { // and to ensure that it's properly formatted
          msg: 'Please provide a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
      set(val) {
        if (val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword); 
      }
    },
      validate: {
        notNull: {
          msg: 'A password is required'
        }
      }
    }

  }, { sequelize });
  
  // One User can be associated with 1 or more courses
  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'administrator', //alias
      foreignKey: { 
        fieldName: 'userId',
        allowNull: false,
    },
  });
};

  return User;

};