const RedisWrapper = require('../app/redis/RedisWrapper');

const workerTrip = require("./AgentsNotification")
class WorkerProcessEvent {
    constructor() {
        RedisWrapper.sub.subscribe("new-trip");
    }
    registerSubscribeEventApplication() {
        console.log("registerSubscribeEventApplication");
        RedisWrapper.sub.on("message", async function (channel, message) {
            switch (channel) {
                case "new-trip": {
                    await workerTrip.notifyWhenNewTripCreate(message);
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