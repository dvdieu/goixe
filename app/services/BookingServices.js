const redis = require("../redis/RedisWrapper").crud;
const WorkerTrip = require("../redis/WorkerTrip")
const driverServices = require("./DriverServices");
const tripServices = require("./TripServices");
const ERRORAPPLICATION = require("../ErrorCode")
module.exports = {
    async catchTrip(driverId, tripId) {
        try {
            let bookingKey = "booking:" + tripId;
            let currentBooking = await redis.get(bookingKey);
            if (redis.hget(tripId, driverId) === null) {
                throw new Error(ERRORAPPLICATION.THE_TRIP_HAS_BEEN_ASSIGNED_TO_ANOTHER_ASSET)
            }
            if (currentBooking === driverId) {
                return tripServices.getById(tripId); //Đã Nhận
            }
            if (redis.setnx(bookingKey, driverId)) {
                let driver = await driverServices.DriverServices.updateOnCatch(driverId, tripId);
                if (driver) {
                    let trip = await tripServices.catchTrip(tripId, driverId);
                    let payload = {"driver": driver, "trip": trip};
                    await WorkerTrip.jobHasBeenReceived(payload);
                    return trip;
                } else {
                    redis.del(bookingKey);
                    throw new Error(ERRORAPPLICATION.YOU_HAVE_NOT_COMPLETED_THE_PREVIOUS_TRIP)
                }

            } else {
                throw new Error(ERRORAPPLICATION.THE_TRIP_HAS_BEEN_ASSIGNED_TO_ANOTHER_ASSET)
            }
        } catch (e) {
            throw e;
        }
    },
    async cancelTrip(driverId, tripId) {
        try {
            let trip = await tripServices.cancelTrip(tripId, driverId);

            if (trip) {
                return trip;
            } else {
                return -1;
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async goToCustomers(driverId, tripId) {
        try {
            let driver = await driverServices.DriverServices.get(driverId);
            let trip = await tripServices.goToCustomer(tripId, driverId);
            let payload = {"driver": driver, "trip": trip};
            await WorkerTrip.driverGoToCustomer(payload);
            return trip;
        } catch (e) {
            console.log(e);
            throw e;
        }
        return -1;
    },
    async go(driverId, tripID) {
        try {
            let driver = await driverServices.DriverServices.get(driverId);
            let trip = await tripServices.startTrip(tripID, driverId);
            let payload = {"driver": driver, "trip": trip};
            await WorkerTrip.startTrip(payload);
            return trip;
        } catch (e) {
            console.log(e);
            throw e;
        }
        return -1;
    },
    async finishTrip(driverId, tripID) {
        try {
            let trip = await tripServices.finishTrip(tripID, driverId)
            await WorkerTrip.startTrip(trip);
            return trip;
        } catch (e) {
            console.log(e);
            throw e;
        }
        return -1;
    }
};