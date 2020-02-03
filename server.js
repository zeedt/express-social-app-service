const port = 3001
const app = require('./middleware/index').app ;

require('./users/controller')(app);
require('./post/controller')(app);
require('./comment/controller')(app);

 app.listen(port, ()=> {
     console.log("app is listening on port " + port);
 });