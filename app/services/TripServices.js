const db = require("../models");
const publishEvent = require("../redis/pub");
const Trip = db.Trip;
module.exports = {
    async createNewTrip(payload) {
        try {
            let newTrip = await Trip.create(new Trip(payload));
            publishEvent.publish("new-trip", newTrip.toJSON())
            return newTrip;
        } catch (e) {
            throw e
        }
    },
    async getById(tripId) {
        try {
            return Trip.findById(tripId);
        } catch (e) {
            throw e
        }
    },
    async cancelTrip(tripId, driverId) {
        try {
            return await Trip.findOneAndUpdate({"_id": tripId, "driverId_for_capture": {"$ne": driverId}},
                {
                    "$addToSet": {"driverId_for_excluded": driverId}
                },
                {new: true});
        } catch (e) {
            throw e;
        }
    },
    async catchTrip(tripId, driverId) {
        try {
            let query = {"_id": tripId, "status": {"$in": ["draft", "initial"]}};
            return Trip.findOneAndUpdate(query, {"driverId_for_capture": driverId, "status": "initial"}, {
                new: true
            });
        } catch (e) {
            throw e;
        }
    },
    async goToCustomer(tripId, driverId) {
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_for_capture": driverId,
                "status": {"$in": ["gocustomer", "initial"]}
            }, {"status": "gocustomer"}, {
                new: true
            });
        } catch (e) {
            throw e;
        }
    },
    async startTrip(tripId, driverId) {
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_for_capture": driverId,
                "status": {"$in": ["gocustomer", "initial"]}
            }, {"status": "starttrip", "driverId_in_trip": driverId}, {
                new: true
            });
        } catch (e) {
            throw e;
        }
    },
    async finishTrip(tripId, driverId) {
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_in_trip": driverId,
                "status": {"$in": ["starttrip", "finish"]}
            }, {"status": "finish", "driverId_in_trip": "", "driverId_for_capture": ""}, {
                new: true
            });
        } catch (e) {
            throw e;
        }
    },
    async listTrip(status,dateFrom,dateTo,page,size){
        page = page <0 ? 0 : page;
        try {
            if(status===null || status.length===0)
                return Trip.find({}).limit(parseInt(size)).skip(parseInt(size*page)).sort({"createdAt":-1});
            return Trip.find({"status":{"$in":status},"createdAt":{
                    $gte: Math.min(dateTo,dateFrom),
                    $lte:Math.max(dateTo,dateFrom)}}).limit(parseInt(size)).skip(parseInt(size*page)).sort({"createdAt":-1});
        } catch (e) {
            throw e;
        }
    }
}