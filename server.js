const port = 3001
const app = require('./middleware/index').app ;

require('./users/controller')(app);
require('./post/controller')(app);
require('./comment/controller')(app);

// var server = require('http').Server(app);
var server = require('./socket/connection').initiateSocketServer(app);

var IOSetUp = require('./socket/IOSetUp').getIo(server);

var socketEventsHandler = require('./socket/events-handler')(IOSetUp);

 server.listen(port, ()=> {
     console.log("app is listening on port " + port);
 });