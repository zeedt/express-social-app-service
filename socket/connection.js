
const Connection = {
    initiateSocketServer : (app)=> {
        return require('http').Server(app);
    },

    
    io : (server) => {
        return require('socket.io')(server)
    }

}



module.exports = Connection;