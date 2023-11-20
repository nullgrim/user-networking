'use strict';
const { people } = require("../people.json");
const { UserService, FriendsService } = require("../../v1/services")

module.exports = {
  async up(queryInterface, Sequelize) {
    const bulkUserData = [];
    const friendshipMap = new Map();

    // * Seperating friends from user to create relational data via (id) afterwards
    for (const person of people) {
      bulkUserData.push({
        uuid: person.id,
        forename: person.forename,
        surname: person.surname,
        dob: person.dob,
        ssn: person.ssn,
        ssnIssuedDate: person.issuedDateAndTime,
        image: person.image.split('.')[0],
        location: Sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(person.primaryLocation)),
        updatedAt: new Date(),
        createdAt: new Date()
      });

      friendshipMap.set(person.id, person.friends)
    };

    // * Bulk create users
    const users = await UserService.create.bulkUsers(bulkUserData);

    // * Hashmap uuids to ids from the database records (avoids querying db)
    const userIds = new Map();

    for (const user of users) {
      userIds.set(user.uuid, user.id)
    };

    // * Map and create unique sets of ids to avoid duplicate entries
    const userFriends = new Map();

    for (const user of users) {
      const friendships = friendshipMap.get(user.uuid);

      userFriends[user.id] = {
        friends: []
      }

      // * Create a hashmap with userId and their friends, creating a one directional friend system
      for (const friend of friendships) {
        const friendId = userIds.get(friend);

        if (!userFriends[friendId]?.friends.includes(user.id)) {
          userFriends[user.id].friends.push(friendId)
        };
      }
    }

    const bulkFriendData = [];

    // * Create and format an array of objects to insert into the data table
    for (const userId in userFriends) {
      const user = userFriends[userId];

      // * Loop through the user's friends
      for (const friendId of user.friends) {
        const friendObject = {
          userId: userId,
          friendId: friendId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        bulkFriendData.push(friendObject);
      }
    };

    await FriendsService.create.bulkFriendship(bulkFriendData);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
