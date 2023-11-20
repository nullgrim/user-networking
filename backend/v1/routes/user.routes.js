const { UserSchema } = require('../schemas');

function user(fastify, options, done) {
    fastify.get("/users", UserSchema.retrieveUsers);
    fastify.post("/", UserSchema.createUser);
    fastify.get("/relatives/:userId", UserSchema.retrieveRelatives);
    done();
}

module.exports = user;
