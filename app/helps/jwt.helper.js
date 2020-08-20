const jwt = require("jsonwebtoken");
const ROUTERCONST = require("../RouterConst");
let secretSignature = "0964222806";
let tokenLife = 31536000;
let generateToken = async (payload, type) => {
    if(type===ROUTERCONST.DRIVERS.token_type) {
        const driverData = {
            _id: payload.id,
            user_name: payload.user_name,
            driver_name: payload.driver_name,
            type: type,
        }
        var token = await jwt.sign({data: driverData}, secretSignature, {algorithm: 'HS256', expiresIn: tokenLife});
        return token;
    }
    else {
        const userData = {
            _id: payload.id,
            customer_name:payload.name,
            type: type,
        }
        var token = await jwt.sign({data: userData}, secretSignature, {algorithm: 'HS256', expiresIn: tokenLife});
        return token;
    }
    return false;
}

let verifyToken = async (token,secretSignature ,type) => {
    let baseURL = type.slice(1);
    let typeToken = ROUTERCONST[baseURL.toUpperCase()].token_type;
    let verify = await jwt.verify(token, "0964222806");
    if (!verify) {
        return false;
    }
    let data = jwt.decode(token);
    if(data.data.type===typeToken){
        return verify;
    }
    throw new Error("Token Invalid");
}
module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    secretSignature: secretSignature
};