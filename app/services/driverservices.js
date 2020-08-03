const db = require("../models");
const Driver = db.Driver;
const Auth = require("../helps/jwt.helper")

class DriverServices {
    constructor() {
    }

    getHash(salt, value) {
        let token = CryptoJS.HmacSHA1(salt, value);
        return token;
    }

    static async near(long, lat, distance) {
        try {
            return Driver.find({
                location: {
                    $nearSphere: {$geometry: {type: 'Point', coordinates: [long, lat]}, $maxDistance: distance}
                }
            })
        } catch (e) {
            throw e;
        }
        return false;
    }

    static async    get(id) {
        return Driver.findById(id);
    }

    static async loginDriver(userName, passWord) {
        let driver = await Driver.findOne({"user_name": userName.toLocaleLowerCase(), "password": passWord});
        if (driver == null) {
            return null;
        }

        return Auth.generateToken(driver);
    }

    static async updateDriver(id, payload) {
        return Driver.findOneAndUpdate({_id: id}, payload);
    }

    static async createNewDriver(payload) {
        let driver = new Driver(payload);
        return Driver.create(driver);
    }
}

module.exports = {DriverServices};