const DatabaseConfig = require('./config');
const fs = require("node:fs");
const path = require("node:path");
const basename = path.basename(__filename);
const schemas = `${__dirname}/schemas`;

const dbConfig = DatabaseConfig[process.env.ENVIRONMENT !== "production" ? "development" : "production"];

const Sequelize = require("sequelize");

// * Initialize sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    dialectOptions: {
        supportBigNumbers: true
    },
    logging: process.env.ENVIRONMENT !== "production" ? console.log : false,
    // benchmark: true,
});


const models = {};

// * Get & Set all the database models
fs.readdirSync(schemas)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        const model = require(path.join(schemas, file))(sequelize, Sequelize.DataTypes);
        models[model.name] = model;
    });

// * Set up associations
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(sequelize.models);
    }
})

module.exports = {
    Op: Sequelize.Op,
    fn: Sequelize.fn,
    models: sequelize.models,
    sequelize
};
