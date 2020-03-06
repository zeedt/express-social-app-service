const port = 3001
const app = require('./middleware/index').app ;
var connectedUsers = [];
var socketIds = [];
require('./users/controller')(app);
require('./post/controller')(app);
require('./comment/controller')(app);

var server = require('./socket/connection').initiateSocketServer(app);

var io = require('./socket/IOSetUp').getIo(server);
var socketEventsHandler = require('./socket/events-handler')(io);


 server.listen(port, ()=> {
     console.log("app is listening on port " + port);
 });