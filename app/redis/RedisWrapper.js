const redis = require('redis');
const redisIO = require('ioredis');
const redisAdapter = require('socket.io-redis');
const adapter = redisAdapter({ host: '13.114.129.134', port: 6379,auth_pass:"9195e640915b0b476c4699ecb9c129e4fa542181"})
const publisher = redis.createClient({ host: '13.114.129.134', port: 6379});
const crud =new redisIO({
    port: 6379, // Redis port
    host: "13.114.129.134", // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: "9195e640915b0b476c4699ecb9c129e4fa542181",
    db: 0,
});
crud.auth("9195e640915b0b476c4699ecb9c129e4fa542181",function (e){

});
publisher.auth("9195e640915b0b476c4699ecb9c129e4fa542181",function (e){

});
const sub = redis.createClient({ host: '13.114.129.134', port: 6379});
sub.auth("9195e640915b0b476c4699ecb9c129e4fa542181",function (e){

});

module.exports = {
    publish:(channel,payload)=>{
        publisher.publish(channel, payload)
    },
    sub:sub,
    adapter:adapter,
    crud:crud,
    redis:redis
}