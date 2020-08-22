const amqp = require('amqplib');
module.exports={
    async AMQPGetConnection(){

        const URL="amqp://3drams:9195e640915b0b476c4699ecb9c129e4fa542181@45.117.168.135";
        const conn = await amqp.connect(URL);
        const ch = await conn.createChannel();
        return ch;
    }
}