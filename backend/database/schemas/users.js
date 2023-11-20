'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.belongsToMany(users, {
        as: "friends",
        through: models.user_friends,
        foreignKey: "userId",
        otherKey: "friendId"
      })
      users.belongsToMany(users, {
        as: 'friendOf',
        through: models.user_friends,
        foreignKey: 'friendId',
        otherKey: 'userId',
      });
    }
  }
  users.init({
    uuid: {
      type: DataTypes.UUID
    },
    forename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ssn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ssnIssuedDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.GEOGRAPHY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};