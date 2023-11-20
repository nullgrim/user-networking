const { models } = require("../../database");

module.exports = {
    create: {
        bulkFriendship: async (data) => {
            try {
                return await models.user_friends.bulkCreate(data);
            } catch (err) {
                console.log("Error occurred whilst bulk creating users", err)
                return [];
            }
        },
    },
    retrieve: {
    },
    update: {},
    delete: {},
    count: {}
}