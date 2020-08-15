const RedisWrapper = require("../redis/RedisWrapper")
/**
 * USED AUTH
 */
const authSocket = require("./SocketAuthentication")
const driverService = require("../services/DriverServices").DriverServices
let registerEvent = async (io, path) => {
    const nsp = io.of(path);
    nsp.use(authSocket.isAuth);
    nsp.on('connection', async function (socket) {
        console.log(socket.id);
        try {
            await RedisWrapper.crud.hset("driver_online", socket.contextAuthenToken.data._id, socket.id);
            console.log('someone connected');
            let message = JSON.stringify(socket.contextAuthenToken.data);
            nsp.emit('pong',message);
            socket.on("gps",async function (message){
                await driverService.updateGPS(socket.contextAuthenToken.data._id,message.long,message.lat,message.direction,message.velocity,message.radius);
            });
            socket.on("disconnect", async function (reason) {
                await RedisWrapper.crud.hdel("driver_online", socket.contextAuthenToken.data._id);
                console.log(reason);
            })
        } catch (e) {
            console.log(e);
        }
    });
};
module.exports = registerEvent;