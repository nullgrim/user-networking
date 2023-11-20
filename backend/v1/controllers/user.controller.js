const { ErrorConstants } = require("../constants");
const { UserService, FriendsService } = require("../services");
const { fn } = require("../../database");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    retrieveUserRelatives: async (req, res) => {
        const relations = await UserService.retrieve.relatives(req.params.userId);

        const formatData = (data) => ({
            id: data.id,
            surname: data.surname,
            forename: data.forename,
            ssn: data.ssn,
            image: data.image,
            dob: new Date(data.dob).getTime()
        });

        const formatRelations = (user) => {
            const friends = user.friends || [];
            const friendOf = user.friendOf || [];

            return {
                ...formatData(user),
                relations: [
                    ...friends.map((friend) => formatRelations(friend)),
                    ...friendOf.map((friend) => formatRelations(friend)),
                ],
            };
        };

        const formattedRelations = relations.map((user) => formatRelations(user));

        return res.status(200).send({
            success: true,
            relatives: formattedRelations
        });
    },
    retrieveUsers: async (req, res) => {
        const { search, limit } = req.query;

        const users = await UserService.retrieve.matchingUsers({
            search,
            limit
        });

        const formattedUsers = [];

        // * Concatinate the friend relations both ways
        for (const user of users) {
            const totalFriends = user.friends.length + user.friendOf.length
            formattedUsers.push({
                id: user.id,
                forename: user.forename,
                surname: user.surname,
                dob: new Date(user.dob).getTime(),
                ssn: user.ssn,
                ssnIssuedDate: new Date(user.ssnIssuedDate).getTime(),
                image: user.image,
                friends: totalFriends
            })
        };

        return res.status(200).send({
            users: formattedUsers
        });
    },
    createUser: async (req, res) => {
        const user = await UserService.create.user({
            uuid: uuidv4(),
            forename: req.body.forename,
            surname: req.body.surname,
            dob: req.body.dob,
            ssn: req.body.ssn,
            ssnIssuedDate: req.body.ssnIssuedDate,
            image: req.body.image,
            location: fn('ST_GeomFromGeoJSON', JSON.stringify(req.body.location)),
        });

        if (user) {
            const bulkFriendIds = req.body.friendsIds.map((friendId) => {
                return {
                    userId: user.id,
                    friendId
                }
            });

            await FriendsService.create.bulkFriendship(bulkFriendIds);

            return res.status(201).send({
                success: true,
                user: {
                    id: user.id
                }
            });
        }

        return res.status(200).send({
            success: true,
            user: false
        })
    }
}