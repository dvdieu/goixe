
let registerEvent = async (io, path) => {
    const nsp = io.of(path);
    // nsp.use(authSocket.isAuth);
    nsp.on('connection', function (socket) {
        console.log(socket.id);
        console.log('CLIENTS connected');
        nsp.emit('pong', "CLIENTS STARED APPLICATION");
        socket.on("disconnect",function (reason){
            console.log(reason);
        })

    });
};
module.exports = registerEvent;