const db = require("../models");
const Driver = db.Driver;
const Auth = require("../helps/jwt.helper")
const redis = require("../redis/RedisWrapper").crud;
class DriverServices {
    constructor() {
    }
    static async near(long, lat, distance) {
        try {
            return Driver.find({
                "status":"on",
                "location": {
                    $nearSphere: {$geometry: {type: 'Point', coordinates: [long, lat]}, $maxDistance: distance}
                }
            })
        } catch (e) {
            throw e;
        }
        return false;
    }

    static async get(id) {
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
        return Driver.findOneAndUpdate({_id: id}, payload,{new:true});
    }

    static async createNewDriver(payload) {
        let driver = new Driver(payload);
        return Driver.create(driver);
    }
    static async updateOnCatch(driverId,tripId){
        return Driver.findOneAndUpdate({"_id":driverId,"status":{"$in":["on"]}},{"status":"oncatch","in_trip_id":tripId},{new: true});
    }
    static async finishTrip(tripID, driverId){
        return Driver.findOneAndUpdate({"_id":driverId,"status":{"$in":["oncatch"]}},{"status":"on","in_trip_id":""},{new: true});
    }
}

module.exports = {DriverServices};