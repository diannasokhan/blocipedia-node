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
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis",
    });
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    });
    User.prototype.isAdmin = function(){
      return this.role === "admin";
    };
    User.prototype.isPremium = function(){
      return this.role === "premium";
    };
    User.prototype.isStandard = function(){
      return this.role === "standard";
    };
  };
  User.prototype.isAdmin = function(){
      return this.role === "admin";
    };
    User.prototype.isPremium = function(){
      return this.role === "premium";
    };
    User.prototype.isStandard = function(){
      return this.role === "standard";
    };
  
  return User;
};