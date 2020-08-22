const redis = require("../redis/RedisWrapper").crud;
const WorkerTrip = require("../../notification/Agents_WorkerPush")
const driverServices = require("./DriverServices");
const tripServices = require("./TripServices");
const ERRORAPPLICATION = require("../ErrorCode")
const mongoose = require("mongoose")
module.exports = {
    async catchTrip(driverId, tripId) {
        const sessionDriver = await mongoose.startSession();
        const sessionTrip = await mongoose.startSession();
        await sessionTrip.startTransaction();
        await sessionDriver.startTransaction();
        let bookingKey = "booking:" + tripId;
        try {
            let currentBooking = await redis.get(bookingKey);
            if (redis.hget(tripId, driverId) === null) {
                throw new Error(ERRORAPPLICATION.THE_TRIP_HAS_BEEN_ASSIGNED_TO_ANOTHER_ASSET)
            }
            if (currentBooking === driverId) {
                let driver = await driverServices.updateOnCatch(driverId,tripId,sessionDriver);
                let trip = await tripServices.catchTrip(tripId, driverId,sessionTrip);
                if (trip === null || driver === null) {
                    throw new Error(ERRORAPPLICATION.YOU_CAN_NOT_CATCH_THIS_TRIP)
                }
                let payload = {"driver": driver, "trip": trip};
                await WorkerTrip.jobHasBeenReceived(trip.agent_id, payload);
                return tripServices.getById(tripId); //Đã Nhận
            }
            if (redis.setnx(bookingKey, driverId)) {
                let driver = await driverServices.updateOnCatch(driverId, tripId,sessionDriver);
                let trip = await tripServices.catchTrip(tripId, driverId,sessionTrip);
                if (driver && trip) {
                    let payload = {"driver": driver, "trip": trip};
                    await WorkerTrip.jobHasBeenReceived(trip.agent_id, payload);
                    sessionTrip.commitTransaction();
                    sessionDriver.commitTransaction();
                    return trip;
                } else {
                    redis.del(bookingKey);

                    throw new Error(ERRORAPPLICATION.YOU_CAN_NOT_CATCH_THIS_TRIP)
                }
            } else {
                throw new Error(ERRORAPPLICATION.THE_TRIP_HAS_BEEN_ASSIGNED_TO_ANOTHER_ASSET)
            }
        } catch (e) {
            await sessionDriver.abortTransaction();
            await sessionTrip.abortTransaction();
            redis.del(bookingKey);
            throw e;
        } finally {
            sessionDriver.endSession();
            sessionTrip.endSession();
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
    async goToAgentss(driverId, tripId) {
        try {
            let driver = await driverServices.get(driverId);
            let trip = await tripServices.goToAgents(tripId, driverId);
            if (driver && trip) {
                let payload = {"driver": driver, "trip": trip};
                await WorkerTrip.driverGoToAgents(trip.agent_id, payload);
                return trip;
            }
            throw Error(ERRORAPPLICATION.YOU_NOT_OWNER_TRIP);
        } catch (e) {
            console.log(e);
            throw e;
        }
        return -1;
    },
    async go(driverId, tripID) {
        const sessionDriver = await mongoose.startSession();
        const sessionTrip = await mongoose.startSession();
        try {
            let driver = await driverServices.get(driverId);
            let trip = await tripServices.startTrip(tripID, driverId,sessionTrip);
            let payload = {"driver": driver, "trip": trip};
            if (driver && trip) {
                await WorkerTrip.startTrip(trip.agent_id, payload);
                sessionDriver.commitTransaction();
                sessionTrip.commitTransaction();
                return trip;
            }
            throw Error(ERRORAPPLICATION.THE_TRIP_COMPLETED);
        } catch (e) {
            sessionDriver.abortTransaction();
            sessionTrip.abortTransaction();
            throw e;
        }
        return -1;
    },
    async finishTrip(driverId, tripID) {
        const sessionDriver = await mongoose.startSession();
        const sessionTrip = await mongoose.startSession();
        try {
            let trip = await tripServices.finishTrip(tripID, driverId,sessionTrip)
            let driver = await driverServices.finishTrip(tripID, driverId,sessionDriver)
            if (trip && driver) {
                await WorkerTrip.finishTrip(trip.agent_id, trip);
                sessionDriver.commitTransaction();
                sessionTrip.commitTransaction();
                return trip;
            }
            throw Error(ERRORAPPLICATION.THE_TRIP_COMPLETED);
        } catch (e) {
            sessionDriver.abortTransaction();
            sessionTrip.abortTransaction();
            throw e;
        } finally {
            let bookingKey = "booking:" + tripID;
            await redis.del(bookingKey);
        }
    },
    async inCharge(driverId) {
        try {
            let driver = await driverServices.get(driverId);
            if (driver) {
                if (driver.in_trip_id !== null && driver.in_trip_id !== "") {
                    return await tripServices.getById(driver.in_trip_id);
                }
            }
            return null;
        } catch (e) {
            throw e;
        }
    }
};