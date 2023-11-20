const { models, Op } = require("../../database");

module.exports = {
    create: {
        user: async (data) => {
            try {
                return await models.users.create({
                    ...data
                });
            } catch (err) {
                console.log("Error occurred whilst creating a single user", err)
                return null;
            }
        },
        bulkUsers: async (users) => {
            try {
                return await models.users.bulkCreate(users, { returns: true })
            } catch (err) {
                console.log("Error occurred whilst bulk creating users", err)
                return [];
            }
        }
    },
    retrieve: {
        users: async (children) => {
            try {
                return await models.users.findAll({
                    ...children
                })
            } catch (err) {
                console.log("Error occurred whilst creating users", err)
                return [];
            }
        },
        matchingUsers: async ({ search, limit }) => {
            try {
                return await models.users.findAll({
                    where: {
                        [Op.or]: [
                            {
                                forename: {
                                    [Op.iLike]: `%${search}%`
                                }
                            },
                            {
                                surname: {
                                    [Op.iLike]: `%${search}`
                                }
                            },
                            {
                                ssn: {
                                    [Op.eq]: parseInt(search) || null
                                }
                            }
                        ]
                    },
                    include: [{
                        model: models.users,
                        as: 'friends',
                        attributes: ['id']
                    }, {
                        model: models.users,
                        as: 'friendOf',
                        attributes: ['id']
                    }],
                    order: [['id', 'DESC']],
                    limit,
                })
            } catch (err) {
                console.log("Error occurred whilst fetching matched users", err)
                return [];
            }
        },
        relatives: async (userId) => {
            const includesFormat = [{
                model: models.users,
                as: 'friends',
                attributes: ['id', 'surname', 'forename', 'ssn', 'image', 'dob'],

            }, {
                model: models.users,
                as: 'friendOf',
                attributes: ['id', 'surname', 'forename', 'ssn', 'image', 'dob'],
            }];

            try {
                return await models.users.findAll({
                    where: {
                        id: userId
                    },
                    include: [{
                        model: models.users,
                        as: 'friends',
                        attributes: ['id', 'surname', 'forename', 'ssn', 'image', 'dob'],
                        include: includesFormat,
                    }, {
                        model: models.users,
                        as: 'friendOf',
                        attributes: ['id', 'surname', 'forename', 'ssn', 'image', 'dob'],
                        include: includesFormat,
                    }]
                });
            } catch (err) {
                console.log("Error occurred whilst fetching relatives", err)
                return [];
            }
        }
    },
    update: {},
    delete: {},
    count: {
        users: async (children) => {
            try {
                return await models.users.count({
                    ...children
                })
            } catch (e) {
                console.log("Error occurred whilst counting users", err)
                return null
            }
        }
    }
}