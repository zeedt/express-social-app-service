var connectedUsers = [];
var socketIds = [];

// setInterval(() => {
//     console.log(connectedUsers.length)
// }, 1000)

const getUserSocketsToPushTo = (username) => {
    var userSocketsToReceive = [];
    connectedUsers.map(user => {
        if (user.username === username) {
            userSocketsToReceive.push(user.socketId);
        }
    });

    console.log("Number of users to push to " + userSocketsToReceive.length);
    return userSocketsToReceive;
}
const IOEvents = (io) => {

    io.on('connection', socket => {

        io.emit('connection-received', {})

        socket.on('join', data => {
            console.log("REceived user ");
            console.dir(data)
            if (socketIds.includes(socket.id)) {
                // console.log("Socket already exists");
                return;
            } else {
                socket.username = data.username;
                connectedUsers[socket.username] = socket;
                var userObject = {
                    username: data.username,
                    socketId: socket.id,
                    name: data.first_name + ' ' + data.last_name
                };
                if (!socketIds.includes(socket.id)) {
                    connectedUsers.push(userObject);
                    socketIds.push(socket.id);
                }
                io.emit('all-users', connectedUsers);
            }

        });

        socket.on('private-message-sent', data => {
            console.dir(data);
            //dispatch to the sender as well, so all connected sockets for that user can have their chat history updated

            io.to(socket.id).emit('private-message-received', data);

            var socketsToPushMessageTo = getUserSocketsToPushTo(data.fromUsername);
            console.log('Number of sockets to send to ' + getUserSocketsToPushTo(data.fromUsername));
            socketsToPushMessageTo.map(socketId => {
                socket.broadcast.to(socketId).emit('private-message-received', data);
                console.log("Emitted to " + socketId);
            })


            socketsToPushMessageTo = getUserSocketsToPushTo(data.toUsername);
            console.log('Number of sockets to send to ' + getUserSocketsToPushTo(data.toUsername));
            socketsToPushMessageTo.map(socketId => {
                socket.broadcast.to(socketId).emit('private-message-received', data);
                console.log("Emitted to " + socketId);
            })
            // io.emit('private-message-received', data);
            // console.log("Emmitted");
        });

        socket.on('disconnect', () => {
            connectedUsers = connectedUsers.filter(user => {
                return user.socketId !== socket.id;
            });
            socketIds = socketIds.filter(socketId => {
                return socketId !== socket.id;
            });
            io.emit('all-users', connectedUsers);
        });

    });

}

module.exports = IOEvents;