const redis = require('redis');
const publisher = redis.createClient({ host: '13.114.129.134', port: 6379});
publisher.auth("9195e640915b0b476c4699ecb9c129e4fa542181",function (e){

});
module.exports = {
    publish:(channel,payload)=>{
        publisher.publish(channel, JSON.stringify(payload))
    }
}