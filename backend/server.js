const { build } = require("./app.js");

const start = async () => {
    const envToLogger = {
        development: {
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            },
        },
        production: false,
    };

    const app = await build({
        logger: envToLogger[process.env.ENVIRONMENT] ?? true,
        // * Reverse proxy
        // trustProxy: true
    });

    try {
        await app.listen({ port: process.env.API_PORT });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    };

};

start();