const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const app = express();
const ROUTERCONST = require("./app/RouterConst")

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// mongoose init
const db = require("./app/models");
const {WorkerProcessEvent} = require("./notification/DriversNotification");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to application. 0964222806"});
});

app.use(ROUTERCONST.DRIVERS.base_url, require('./app/routes/Driver.routes'));
app.use(ROUTERCONST.AGENTS.base_url, require('./app/routes/Agents.routes'));
app.use('/operations', require('./app/routes/Operation.routes'));
// set port, listen for requests
const PORT = process.env.PORT || 8080;


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);

});

/**
 * SOCKETIO
 */

// });


const redisAdapter = require('./app/redis/RedisWrapper').adapter;
/**
 * SUBS REDIS
 */
const socketIO = require('socket.io')(server)
socketIO.adapter(redisAdapter);

socketIO.set('match origin protocol', true);

socketIO.set('origins', '*:*');

socketIO.set('log level', 1);
socketIO.on('connection', (socket) => {
    socket.on('disconnect', (reason) => {
        console.log(reason);
    });
});
global.io = socketIO;
const socketApplication = require("./app/config/socket")(socketIO);
const {agenda,setup} = require("./app/helps/Scheduler");
new WorkerProcessEvent(socketIO).registerSubscribeEventApplication();



/**
 start scheduler job
 */


(async function() {
    await setup();
    await agenda.start();
    // global.AMQPConnection = await AMQPGetConnection();
    // await AMQPSetUpDomainBroker(global.AMQPConnection);
    // await AMQPRegisterConsumer(DOMAIN_EVENT.TRIPS,"new_trip","",AMQPConsumerProcessOnNewTrip);
})();