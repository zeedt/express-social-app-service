const {connection, Sequelize} = require('../');

const User = connection.define('users', {
    username : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true,
        validate : {
            len : [3,20]
        }
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            len : [6]
        }
    },
    first_name : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            len : [3]
        }
    },
    last_name : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            len : [3]
        }
    },
    gender : {
        type : Sequelize.ENUM,
        values : ['MALE', 'FEMALE'],
        allowNull : false
    },
    display_picture : {
        type : Sequelize.TEXT
    }
});

module.exports = User;