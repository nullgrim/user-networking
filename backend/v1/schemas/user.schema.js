const { UserService } = require("../services");
const { UserController } = require("../controllers");
const { ErrorConstants } = require("../constants");
const fastify = require('fastify')();

// * Reusable schema
const relativeSchema = {
    $id: 'relative',
    type: 'object',
    properties: {
        id: { type: 'integer' },
        forename: { type: 'string' },
        surname: { type: 'string' },
        ssn: { type: 'number' },
        image: { type: 'string' },
        dob: { type: 'number' },
        relations: {
            type: 'array',
            items: { $ref: 'relative#' },
        },
    },
};

fastify.addSchema(relativeSchema);

module.exports = {
    retrieveUsers: {
        schema: {
            description: "Retrieve users by search.",
            tags: ['retrieve', 'users', 'search'],
            summary: "Search for users",
            response: {
                200: {
                    type: "object",
                    description: "OK",
                    properties: {
                        users: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "number" },
                                    forename: { type: "string" },
                                    surname: { type: "string" },
                                    dob: { type: "number" },
                                    ssn: { type: "string" },
                                    ssnIssuedDate: { type: "number" },
                                    image: { type: "string" },
                                    friends: { type: "number" }
                                }
                            }
                        }
                    }
                },
            },
        },
        handler: UserController.retrieveUsers
    },
    retrieveRelatives: {
        schema: {
            params: {
                type: 'object',
                required: ['userId'],
                properties: {
                    userId: { type: 'integer' },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        relatives: {
                            type: 'array',
                            items: relativeSchema,
                        },
                    },
                },
            },
        },
        handler: UserController.retrieveUserRelatives,
    },
    createUser: {
        schema: {
            description: "Create a user database entry",
            tags: ['create', 'user'],
            summary: "Create a user",
            body: {
                type: "object",
                properties: {
                    forename: { type: "string", minLength: 2, maxLength: 70 },
                    surname: { type: "string", minLength: 2, maxLength: 70 },
                    ssn: { type: "number" },
                    ssnIssuedDate: { type: "string" },
                    dob: { type: "string" },
                    image: {
                        type: "string",
                        enum: [
                            'criminal',
                            'fire-fighter',
                            'inmate-female',
                            'medic',
                            'lawyer',
                            'insurgent'
                        ]
                    },
                    friendsIds: {
                        type: "array",
                        items: {
                            type: "integer"
                        }
                    }
                },
                required: ['forename', 'surname', 'ssn', 'ssnIssuedDate', 'dob', 'image', 'friendsIds']
            },
        },
        response: {
            200: {
                type: "object",
                description: "OK",
                properties: {
                    success: {
                        type: "boolean"
                    },
                    user: {
                        type: "object",
                        properties: {
                            id: { type: "string" }
                        }
                    }
                }
            },
        },
        preHandler: async (req, res) => {
            const { ssn, dob, ssnIssuedDate } = req.body;

            if (isNaN(Date.parse(dob)) || isNaN(Date.parse(ssnIssuedDate))) {
                return res.status(400).send(ErrorConstants.params.invalidDate)
            }

            const user = await UserService.count.users({
                where: {
                    ssn
                }
            });

            if (user) {
                return res.status(409).send(ErrorConstants.user.duplicate)
            };
        },
        handler: UserController.createUser
    }
}