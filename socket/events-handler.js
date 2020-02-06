var connectedUsers = [];

const IOEvents = (io) => {


    io.on('connection', socket => {
        console.log('Client connected ' + socket.id);


        socket.on('join', data => {
            console.log('joining' + JSON.stringify(data));
            socket.username = data.username;
            connectedUsers[socket.username] = socket;
            var userObject = {
                username : data.username,
                socketId : socket.id,
                name : data.name
            };
            connectedUsers.push(userObject);
            console.dir(connectedUsers);
            io.emit('all-users', connectedUsers);
        })


    });
}

module.exports = IOEvents;