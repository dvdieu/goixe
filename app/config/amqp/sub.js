module.exports={
    async AMQPRegisterConsumer(channelName,queueName,routingKey,worker){
        const ch = global.AMQPConnection;
        ch.prefetch(1);
        ch.assertQueue(queueName);
        ch.bindQueue(queueName,channelName,routingKey);
        ch.consume(queueName, worker,{ noAck: true });
    },
}