const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const app = express();

var corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// mongoose init
const db = require("./app/models");
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

app.use('/trips', require('./app/routes/trip.routes'));
app.use('/drivers', require('./app/routes/driver.routes'));
// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

/**
 * SOCKETIO
 */

const redis = require('redis');
// });


const redisAdapter = require('socket.io-redis');
/**
 * SUBS REDIS
 */
const socketIO = require('socket.io')(server)
socketIO.adapter(redisAdapter({ host: '13.114.129.134', port: 6379,auth_pass:"9195e640915b0b476c4699ecb9c129e4fa542181"}));

socketIO.set('match origin protocol', true);

socketIO.set('origins', '*:*');

socketIO.set('log level', 1);
socketIO.on('connection', (socket) => {
    socket.on('disconnect', (reason) => {
        // ...
        console.log(reason);
    });
});
global.io = socketIO;
const socketApplication = require("./app/config/socket")(socketIO);
const wokerProcessEvent= require("./app/redis/wokerProcessEvent");
new wokerProcessEvent.WorkerProcessEvent(socketIO).registerSubscribeEventApplication();


