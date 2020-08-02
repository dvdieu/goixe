const jwtHelper = require("../helps/jwt.helper");
const driverServices = require("../services/driverservices").DriverServices;

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
    nsp.on('connection', function (socket) {
        socket.join("drivers_online");
        console.log('someone connected');
        nsp.emit('pong', "DRIVER STARED APPLICATION");
    });
};
module.exports = registerEvent;