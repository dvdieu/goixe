const jwt = require("jsonwebtoken");
let secretSignature="0964222806";
let tokenLife=31536000;
let generateToken = async (payload) => {
    const userData = {
        _id: payload.id,
        user_name: payload.user_name,
        driver_name: payload.driver_name,
    }
    // Thực hiện ký và tạo token
    var token = await jwt.sign({ data: userData }, secretSignature, { algorithm: 'HS256',expiresIn: tokenLife});
    return token;
}

let verifyToken = async (token) => {
        return await jwt.verify(token, secretSignature);
}
module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    secretSignature:secretSignature
};