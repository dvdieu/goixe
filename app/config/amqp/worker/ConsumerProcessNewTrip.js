const {notifyWhenNewTripCreate} = require("../../../../notification/AgentsNotification");
module.exports={
    AMQPConsumerProcessOnNewTrip(message){
        notifyWhenNewTripCreate(String(message.content));
        // console.log(String(message.content));
    }
}