const jwtHelper = require("../helps/jwt.helper");
const driverServices = require("../services/driverservices").DriverServices;
const RedisWrapper = require("../redis/RedisWrapper")
/**
 * USED AUTH
 */
const authSocket = require("../socket/socketAuthentication")

let deCodeToken = async function (token) {
    try {
        let tokenDecode = await jwtHelper.verifyToken(token);
        if (tokenDecode) {
            let driverInDB = await driverServices.get(tokenDecode.data._id);
            if (driverInDB) {
                return driverInDB;
            }
        }
    } catch (e) {
        throw e;
    }
    return false;
}
let registerEvent = async (io, path) => {
    //socket.join("driver_online");
    const nsp = io.of(path);
    nsp.use(authSocket.isAuth);
    nsp.on('connection', function (socket) {
        console.log(socket.id);
        RedisWrapper.crud.HSET("driver_online",socket.contextAuthenToken.data._id,socket.id);
        console.log('someone connected');
        nsp.emit('pong', "DRIVER STARED APPLICATION");
        socket.on("disconnect",function (reason){
            RedisWrapper.crud.HDEL("driver_online",socket.contextAuthenToken.data._id);
            console.log(reason);
        })

    });
};
module.exports = registerEvent;