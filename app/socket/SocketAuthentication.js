const jwtHelper = require("../helps/jwt.helper");
let isAuth = async (socket, next) => {
    try {
        if (socket.handshake.query && socket.handshake.query.token) {
            let decode =await jwtHelper.verifyToken(socket.handshake.query.token,"",socket.nsp.name);
            if (decode) {
                socket.contextAuthenToken = decode;
                next();
            } else {
                next(new Error('Authentication error'));
            }
        } else {
            next(new Error('Authentication error'));
        }
    }catch (err){
        console.log(err.message)
        next(new Error('Authentication error'));
    }
}
module.exports= {isAuth:isAuth};