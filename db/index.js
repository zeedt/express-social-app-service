const Sequelize = require('sequelize').Sequelize
const connection = new Sequelize('social', process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    host : process.env.POSTGRES_HOST,
    dialect : 'postgres',
    define: {
        freezeTableName: true
    },
    logging : false
});

module.exports = {connection, Sequelize}