const db = require("../models");
const Trip = db.Trips;
const publishEvent = require("../redis/pub");
<<<<<<< HEAD
const ERRORAPPLICATION = require("../ErrorCode");
=======
const SCHEDULE_JOB_NAME = require("../helps/SheduleJobName");
const {addJobSchedule} = require("../helps/Scheduler");
>>>>>>> update
module.exports = {
    async scheduleTrip(payload) {
        try {
            let newTrip = await Trip.create(new Trip(payload));
            await addJobSchedule(SCHEDULE_JOB_NAME.PROCESS_ON_SCHEDULE_TRIP,newTrip.schedule_time, JSON.stringify(newTrip));
            return newTrip;
        } catch (e) {
            throw e
        }
    },
    async createNewTrip(payload) {
        try {
            let newTrip = await Trip.create(new Trip(payload));
            publishEvent.publish("new-trip", newTrip.toJSON())
            return newTrip;
        } catch (e) {
            throw e
        }
    },
    async createNewTripScheduler(payload) {
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
<<<<<<< HEAD
    async catchTrip(tripId, driverId,sessionTrip) {
        try {
            let driverId_for_excluded=[];
            driverId_for_excluded.push(driverId);
            let query = {"_id": tripId, "status": {"$in": ["draft", "initial"]},"driverId_for_excluded":{"$nin":driverId_for_excluded}};
            let trip = await Trip.findOneAndUpdate(query, {"driverId_for_capture": driverId, "status": "initial"}, {
                new: true,sessionTrip
=======
    async catchTrip(tripId, driverId, sessionTrip) {
        try {
            let driverId_for_excluded = [];
            driverId_for_excluded.push(driverId);
            let query = {
                "_id": tripId,
                "status": {"$in": ["draft", "initial"]},
                "driverId_for_excluded": {"$nin": driverId_for_excluded}
            };
            let trip = await Trip.findOneAndUpdate(query, {"driverId_for_capture": driverId, "status": "initial"}, {
                new: true, sessionTrip
>>>>>>> update
            });
            return trip;
        } catch (e) {
            throw e;
        } finally {
        }
        finally {
        }
    },
<<<<<<< HEAD
    async goToCustomer(tripId, driverId,sessionTrip) {
=======
    async goToAgents(tripId, driverId, sessionTrip) {
>>>>>>> update
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_for_capture": driverId,
                "status": {"$in": ["gocustomer", "initial"]}
            }, {"status": "gocustomer"}, {
                new: true,
                sessionTrip
            });
        } catch (e) {
            throw e;
        }
    },
<<<<<<< HEAD
    async startTrip(tripId, driverId,sessionTrip) {
=======
    async startTrip(tripId, driverId, sessionTrip) {
>>>>>>> update
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_for_capture": driverId,
<<<<<<< HEAD
                "status": {"$ne":"finish"}
=======
                "status": {"$ne": "finish"}
>>>>>>> update
            }, {"status": "starttrip", "driverId_in_trip": driverId}, {
                new: true,
                sessionTrip
            });
        } catch (e) {
            throw e;
        }
    },
<<<<<<< HEAD
    async finishTrip(tripId, driverId,sessionTrip) {
=======
    async finishTrip(tripId, driverId, sessionTrip) {
>>>>>>> update
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_in_trip": driverId,
                "status": {"$in": ["starttrip", "finish"]}
            }, {"status": "finish", "driverId_in_trip": "", "driverId_for_capture": ""}, {
                new: true,
                sessionTrip
            });
        } catch (e) {
            throw e;
        }
    },
    async listTrip(status, dateFrom, dateTo, page, size) {
        page = page < 0 ? 0 : page;
        try {
            if (status === null || status.length === 0)
                return Trip.find({}).limit(parseInt(size)).skip(parseInt(size * page)).sort({"createdAt": -1});
            return Trip.find({
                "status": {"$in": status}, "createdAt": {
                    $gte: Math.min(dateTo, dateFrom),
                    $lte: Math.max(dateTo, dateFrom)
                }
            }).limit(parseInt(size)).skip(parseInt(size * page)).sort({"createdAt": -1});
        } catch (e) {
            throw e;
        }
    }
}