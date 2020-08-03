const RedisWrapper = require('./RedisWrapper');
const driverServices = require("../services/driverservices")
const tripServices = require("../services/tripservices")
class WorkerProcessEvent {
    constructor(socketIO) {
        RedisWrapper.sub.subscribe("new-trip");
        RedisWrapper.sub.subscribe("push-notification-trip");
    }

    static sendNotify(message) {
        global.io.of('drivers').to("drivers_online").emit("catchTrip", message);
    }

    static async processHandelNewTrip(message) {
        //Find All Driver Near
        let data = JSON.parse(message);
        let tripId = data._id;
        let lat = data.from_lat;
        let long = data.from_lng;
        let listDriver = await driverServices.DriverServices.near(long, lat, 10);//10
        if (listDriver == null || listDriver == undefined || listDriver.length == 0) {
            //global.io.of("client").emit("");
            //Tất cả tài xế đang bận
            return;
        }
        let listDriverNear = listDriver.map(function (item) {
            return item._id.toString();
        })
        let listDriverOnline = await RedisWrapper.crud.hmget("driver_online", "5f26cee211c7f946741328df", function (err, reply) {
            //Create DataBase Stored For List Diver Near Trip
            reply.forEach(function (value) {
                RedisWrapper.crud.hset(tripId, value, value);
                RedisWrapper.publish("push-notification-trip", tripId);
            })
        });
    }

    registerSubscribeEventApplication() {
        console.log("registerSubscribeEventApplication");
        RedisWrapper.sub.on("message", async function (channel, message) {
            switch (channel) {
                case "new-trip": {
                    //Find All Driver Near
                    let data = JSON.parse(message);
                    let tripId = data.id;
                    let lat = data.from_lat;
                    let long = data.from_lng;
                    let listDriver = await driverServices.DriverServices.near(long, lat, 10);//10
                    if (listDriver == null || listDriver == undefined || listDriver.length == 0) {
                        //global.io.of("client").emit("");
                        //Tất cả tài xế đang bận
                        return;
                    }
                    let listDriverNear = listDriver.map(function (item) {
                        return item._id.toString();
                    })
                    let listDriverOnline = await RedisWrapper.crud.hmget("driver_online", "5f26cee211c7f946741328df", function (err, reply) {
                        //Create DataBase Stored For List Diver Near Trip
                        reply.forEach(function (value) {
                            RedisWrapper.crud.hset(tripId, value, value);
                            RedisWrapper.publish("push-notification-trip", tripId);
                        })
                    });
                    break;
                }
                case "push-notification-trip":{
                    RedisWrapper.crud.hgetall(message, async function (err,reply){
                        let trip = await tripServices.TripServices.getById(message);
                        //EMIT SOCKET
                        Object.keys(reply).forEach(key => {
                            console.log(key);
                            global.io.of("/drivers").to(key).emit("a",JSON.stringify(trip));
                        });
                    });
                    break;
                }
                default : {
                    break;
                }
            }
            console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
        });
    }

}

module.exports = {WorkerProcessEvent};