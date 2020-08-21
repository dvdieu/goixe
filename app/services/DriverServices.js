const db = require("../models");
const Driver = db.Driver;
const Auth = require("../helps/jwt.helper")
const ROUTERCONST = require("../RouterConst");
module.exports = {
    async near(long, lat, distance) {
        try {
            return Driver.find({
                "status": "on",
                "location": {
                    $nearSphere: {$geometry: {type: 'Point', coordinates: [long, lat]}, $maxDistance: distance}
                }
            })
        } catch (e) {
            throw e;
        }
        return false;
    },
    async nearAll(long, lat, distance) {
        try {
            return Driver.find({
                "location": {
                    $nearSphere: {$geometry: {type: 'Point', coordinates: [long, lat]}, $maxDistance: distance}
                }
            })
        } catch (e) {
            throw e;
        }
        return false;
    },
    async get(id) {
        return Driver.findById(id);
    },
    async list_driver_on() {
        return Driver.find({"status": "on"});
    },
    async list_driver_on_catch() {
        return Driver.find({"status": "oncatch"});
    },
    async list_driver_off() {
        return Driver.find({"status": "off"});
    },
    async loginDriver(userName, passWord) {
        let driver = await Driver.findOne({"user_name": userName.toLocaleLowerCase(), "password": passWord});
        if (driver == null) {
            return null;
        }
        return Auth.generateToken(driver, ROUTERCONST.DRIVERS.token_type);
    },
    async updateGPS(driverID, long, lat, direction, velocity, radius) {
        let payloadUpdateGPS = {"type": "Point", "coordinates": [long, lat]}
        let updateQuery = {
            "direction": direction,
            "velocity": velocity,
            "radius": radius,
            "location": payloadUpdateGPS
        };
        return Driver.findOneAndUpdate({_id: driverID}, updateQuery, {new: true});
    },
    async updateDriver(id, payload) {
        return Driver.findOneAndUpdate({_id: id}, payload, {new: true});
    },
    async onDriver(id) {
        return Driver.findOneAndUpdate({_id: id, "status": {$ne: "oncatch"}}, {"status": "on"}, {new: true});
    },
    async offDriver(id) {
        return Driver.findOneAndUpdate({_id: id, "status": {$ne: "oncatch"}}, {"status": "off"}, {new: true});
    },
    async createNewDriver(payload) {
        let driver = new Driver(payload);
        return Driver.create(driver);
    },
    async updateOnCatch(driverId, tripId,session) {
        return Driver.findOneAndUpdate({"_id": driverId, "status": {"$in": ["on", "off"]}}, {
            "status": "oncatch",
            "in_trip_id": tripId
        }, {new: true,session});
    },
    async finishTrip(tripID, driverId) {
        return Driver.findOneAndUpdate({"_id": driverId, "status": {"$in": ["oncatch"]}}, {
            "status": "on",
            "in_trip_id": ""
        }, {new: true});
    }
};