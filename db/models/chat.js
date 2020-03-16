
const {connection, Sequelize} = require('../');
const User = require('./users');

const Chat = connection.define('chat', {
    content : {
        type : Sequelize.TEXT,
        allowNull : false,
        validate : {
            len : [1]
        }
    },
    sender : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            len : [3]
        }
    },
    receiver : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            len : [3]
        }
    }
});

module.exports = Chat;