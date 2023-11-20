function routes(fastify, options, done) {
    fastify.register((route, opts, next) => {
      route.register(require('./user.routes'), { prefix: "/user" });
      next();
    }, { prefix: "/v1" });
  
    done();
  }
  
  module.exports = routes;
  