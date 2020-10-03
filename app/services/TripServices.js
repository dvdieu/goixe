const db = require("../models");
const Trip = db.Trips;
const publishEvent = require("../redis/pub");
const SCHEDULE_JOB_NAME = require("../helps/SheduleJobName");
const {addJobSchedule} = require("../helps/Scheduler");
module.exports = {

    async scheduleTrip(payload) {
        try {
            let newTrip = await Trip.create(new Trip(payload));
            await addJobSchedule(SCHEDULE_JOB_NAME.PROCESS_ON_SCHEDULE_TRIP, newTrip.schedule_time, JSON.stringify(newTrip));
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
    async getById(tripId) {
        try {
            return Trip.findById(tripId);
        } catch (e) {
            throw e
        }
    },
    async driverCancelTrip(tripId, driverId) {
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
            });
            return trip;
        } catch (e) {
            throw e;
        } finally {
        }
    },
    async goToAgents(tripId, driverId, sessionTrip) {
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
    async startTrip(tripId, driverId, sessionTrip) {
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_for_capture": driverId,
                "status": {"$ne": "finish"}
            }, {"status": "starttrip", "driverId_in_trip": driverId}, {
                new: true,
                sessionTrip
            });
        } catch (e) {
            throw e;
        }
    },
    async finishTrip(tripId, driverId, sessionTrip) {
        try {
            return Trip.findOneAndUpdate({
                "_id": tripId,
                "driverId_in_trip": driverId,
                "status": {"$in": ["starttrip", "finish"]}
            }, {"owner_finish": driverId, "status": "finish", "driverId_in_trip": "", "driverId_for_capture": ""}, {
                new: true,
                sessionTrip
            });
        } catch (e) {
            throw e;
        }
    },
    /**
     * Lấy danh sách trips dựa theo trạng thái,
     * @param payload
     * @returns {Promise<*>}
     */
    async listTrip(status, dateFrom, dateTo, page, size) {
        page = page < 0 ? 0 : page;
        try {
            let form = Math.min(dateFrom, dateTo);
            let to = Math.max(dateFrom, dateTo);
            let query ={"status": {"$in": status},
                "createdAt": {
                    "$gte": new Date(form).toISOString(),
                    "$lte": new Date(to).toISOString()
                }}
            return Trip.find(query).limit(parseInt(size)).skip(parseInt(size * page)).sort({"createdAt": -1});
        } catch (e) {
            throw e;
        }
    },
    async listTripForDriverOnFinish(driverId, dateFrom, dateTo, page, size) {
        page = page < 0 ? 0 : page;
        try {
            let form = Math.min(dateFrom, dateTo);
            let to = Math.max(dateFrom, dateTo);
            let query = {
                "owner_finish":driverId,
                "createdAt": {
                    "$gte": new Date(form).toISOString(),
                    "$lte": new Date(to).toISOString()
                }
            }
            return Trip.find(query).limit(parseInt(size)).skip(parseInt(size * page)).sort({"createdAt": -1});
        } catch (e) {
            throw e;
        }
    },
    async cancelTrip(tripId, cancelId) {
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
    listTripForDriverOnCancel(driverId, dateFrom, dateTo, page, size) {
        page = page < 0 ? 0 : page;
        try {
            let form = Math.min(dateFrom, dateTo);
            let to = Math.max(dateFrom, dateTo);
            let query = {
                "driverId_for_excluded":{"$in":[driverId]},
                "createdAt": {
                    "$gte": new Date(form).toISOString(),
                    "$lte": new Date(to).toISOString()
                }
            }
            return Trip.find(query).limit(parseInt(size)).skip(parseInt(size * page)).sort({"createdAt": -1});
        } catch (e) {
            throw e;
        }
    }
}