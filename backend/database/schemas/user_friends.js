'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_friends extends Model {
    static associate(models) {
    }
  }
  user_friends.init({
  }, {
    sequelize,
    modelName: 'user_friends',
  });

  user_friends.removeAttribute("id");
  return user_friends;
};