/**
 * USED AUTH
 */
const authSocket = require("./SocketAuthentication")
const SocketDataBase = require("../persistence/SocketDataBase");
const ROUTERCONST = require("../RouterConst");
let registerEvent = async (io, path) => {
    const nsp = io.of(path);
    nsp.use(authSocket.isAuth);
    nsp.on('connection', async function (socket) {
        try {
            if(socket.contextAuthenToken.data.type===ROUTERCONST.CUSTOMERS.token_type) {
                await SocketDataBase.setSocket(SocketDataBase.dataBaseNameCustomerOnline(), socket.contextAuthenToken.data._id, socket.id);
                console.log('someone connected');
                let message = JSON.stringify(socket.contextAuthenToken.data);
                nsp.emit('pong', message);
                socket.on("disconnect", async function (reason) {
                    await SocketDataBase.delSocket(SocketDataBase.dataBaseNameCustomerOnline(), socket.contextAuthenToken.data._id);
                    console.log(reason);
                })
            }
            else {
                return;
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
};
module.exports = registerEvent;