const amqp = require('amqplib');
module.exports={
    async AMQPGetConnection(){

        const URL="amqps://upudgziy:CnF7nSoJbfgnIuCPk4ekArSxjw9N629E@coyote.rmq.cloudamqp.com/upudgziy";
        const conn = await amqp.connect(URL);
        const ch = await conn.createChannel();
        return ch;
    }
}