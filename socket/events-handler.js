var connectedUsers = [];
var socketIds = [];

setInterval(()=>{
    console.log(connectedUsers.length)
}, 1000)

const IOEvents = (io) => {

    io.on('connection', socket => {

        io.emit('connection-received', {})
    
        socket.on('join', data => {
            if (socketIds.includes(socket.id)){
                console.log("Socket already exists");
                return;
            } else{
                socket.username = data.username;
                connectedUsers[socket.username] = socket;
                var userObject = {
                    username : data.username,
                    socketId : socket.id,
                    name : data.first_name + ' ' + data.last_name
                };
            if (!socketIds.includes(socket.id)){
                connectedUsers.push(userObject);
                socketIds.push(socket.id);
            }
                io.emit('all-users', connectedUsers);
            }
            
        });
    
        socket.on('disconnect', ()=> {
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