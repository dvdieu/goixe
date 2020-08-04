const RedisWrapper = require('./RedisWrapper');
const driverServices = require("../services/DriverServices")
const tripServices = require("../services/TripServices")
const workerTrip = require("./WorkerTrip")
class WorkerProcessEvent {
    constructor() {
        RedisWrapper.sub.subscribe("new-trip");
        RedisWrapper.sub.subscribe("push-notification-trip");
    }
    static sendNotify(message) {
        global.io.of('drivers').to("drivers_online").emit("catchTrip", message);
    }
    registerSubscribeEventApplication() {
        console.log("registerSubscribeEventApplication");
        RedisWrapper.sub.on("message", async function (channel, message) {
            switch (channel) {
                case "new-trip": {
                    await workerTrip.createJobFoTheDriver(message);
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