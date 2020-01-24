const {connection, Sequelize} = require('../../db/index');


const Clients = connection.define('Client', {
    name : Sequelize.STRING,
    clientId : {
        type : Sequelize.STRING,
        unique : true
    },
    clientSecret : Sequelize.STRING
});

const AccessToken = connection.define('AccessToken', {
    userId : Sequelize.BIGINT,
    token : Sequelize.STRING,
    clientId : Sequelize.STRING
})

connection.sync().then(()=>{
    console.log("Connection successful");
}).catch((error)=>{
    console.error("Error occurred due to " + error.message);
})

module.exports = {Clients, AccessToken};