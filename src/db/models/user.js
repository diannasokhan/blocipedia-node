'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      validate: {
        isEmail: {msg: "must be a valid email"}
      },
      type:DataTypes.STRING
    },
    username: {
      allowNull: false,
      type:DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};