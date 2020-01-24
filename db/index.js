const Sequelize = require('sequelize').Sequelize

const connection = new Sequelize('social', 'postgres', 'Andela2.', {
    host : 'localhost',
    dialect : 'postgres',
    define: {
        freezeTableName: true
    }
});

module.exports = {connection, Sequelize}