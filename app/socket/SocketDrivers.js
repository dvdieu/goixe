const RedisWrapper = require("../redis/RedisWrapper")
/**
 * USED AUTH
 */
const authSocket = require("./SocketAuthentication")

let registerEvent = async (io, path) => {
    const nsp = io.of(path);
    nsp.use(authSocket.isAuth);
    nsp.on('connection',async function (socket) {
        console.log(socket.id);
        await RedisWrapper.crud.hset("driver_online",socket.contextAuthenToken.data._id,socket.id);
        console.log('someone connected');
        nsp.emit('pong', "DRIVER STARED APPLICATION");
        socket.on("disconnect",async function (reason){
            await RedisWrapper.crud.hdel("driver_online",socket.contextAuthenToken.data._id);
            console.log(reason);
        })

    });
};
module.exports = registerEvent;