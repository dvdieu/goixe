const redis = require('redis');
const sub = redis.createClient({ host: '13.114.129.134', port: 6379});
sub.auth("9195e640915b0b476c4699ecb9c129e4fa542181",function (e){

});
const driverServices = require("../services/driverservices")
class WorkerProcessEvent{
    constructor(socketIO) {
        sub.subscribe("new-trip");
    }
    static sendNotify(message){
        global.io.of('drivers').to("drivers_online").emit("catchTrip",message);
    }
    registerSubscribeEventApplication(){
        console.log("registerSubscribeEventApplication");
        sub.on("message",async function (channel, message) {
            switch(channel){
                case "new-trip":{
                    //Find All Driver Near
                    let data = JSON.parse(message);
                    let lat = data.from_lat;
                    let long = data.from_lng;
                    let listDriver =await driverServices.DriverServices.near(long,lat,5);//5KM
                    console.log(listDriver);
                    WorkerProcessEvent.sendNotify(message);
                    break;
                }
                default :{
                    break;
                }
            }
            console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
        });
    }

}
module.exports={WorkerProcessEvent};