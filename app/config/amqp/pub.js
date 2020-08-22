const {DOMAIN_EVENT} = require("../../models/event/DOMAIN_EVENT");
module.exports={
    async AMQPSetUpDomainBroker(connection){
        for (const item of Object.keys(DOMAIN_EVENT)) {
            await connection.assertExchange(item, "topic",{durable: true});
        }
    },
    async AMQPPublish(exchangeName,routingKey,payload){
        await global.AMQPConnection.publish(exchangeName,routingKey,new Buffer(payload));
    }
}
