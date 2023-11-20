require("dotenv").config();
const fastify = require("fastify");

const build = async (opts = {}) => {
    const app = fastify(opts);

    app.register(require("@fastify/cors"), {
        origin: "http://localhost:3000"
    });

    app.setErrorHandler(async (error, request, reply) => {
        const { statusCode } = error;
        if (statusCode >= 500) {
            if (process.env.ENVIRONMENT === "production") {
                // * Usually I use Sentry to capture >=500 exceptions in production
            }
            return reply.status(500).send({ error: ErrorConstants.server.internal });
        } else if (statusCode >= 400) {
            // * Handle validation errors
            if (error.validation) {
                const errors = [];

                for (const validationError of error.validation) {
                    errors.push({
                        error: `validation-error`,
                        message: `${error.validationContext + validationError.instancePath} ${validationError.message}`,
                        userFacingMessage: "Validation error occured",
                        params: validationError.params
                    })
                };

                return reply.status(error.statusCode).send({
                    errors
                });
            } else {
                reply.status(error.statusCode).send({
                    error: error.code,
                    message: error.message,
                })
            };
        };

        // * Logs for development
        if (process.env.ENVIRONMENT !== "production") {
            app.log.error(error);
        };
    });

    // * Register routes
    app.register(require('./v1/routes'));

    return app;
}

module.exports = { build };