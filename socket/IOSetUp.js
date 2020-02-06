
const IOSetUp =  {
    getIo : (server) => {
        return require('socket.io')(server);
    }
}


module.exports = IOSetUp;

