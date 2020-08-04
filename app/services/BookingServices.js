const redis = require("../redis/RedisWrapper").crud;
const WorkerTrip = require("../redis/WorkerTrip")
const driverServices = require("./DriverServices");
const tripServices = require("./TripServices");
module.exports = {
    async catchTrip(driverId, tripId) {
        try {
            let bookingKey = "booking:" + tripId;
            let currentBooking = await redis.get(bookingKey);
            if (redis.hget(tripId, driverId) === null) {
                return -3;// Không nằm trong danh sách tài xế được phép || hoặc dã hết hạn
            }
            if (currentBooking === driverId) {
                return tripServices.getById(tripId); //Đã Nhận
            }
            if (redis.setnx(bookingKey, driverId)) {
                let driver = await driverServices.DriverServices.updateOnCatch(driverId, tripId);
                if (driver) {
                    let trip = await tripServices.catchTrip(tripId, driverId);
                    let payload = {"message":"Tài xế đã nhận cuốc xe của bạn","driver": driver, "trip": trip};
                    await WorkerTrip.jobHasBeenReceived(payload);
                    return trip;
                } else {
                    redis.del(bookingKey);
                    return -5; // Tài xế đang bận hoặc đã nhận quốc khác
                }

            } else {
                return -2;//Đã có người khác nhận
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
        return false;
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
            let payload = {"message":"Tài xế đang tới chỗ bạn","driver": driver, "trip": trip};
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
            let payload = {"message":"Bạn đang trong chuyến đi, chúc thượng lộ bình an","driver": driver, "trip": trip};
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
            return trip;
        } catch (e) {
            console.log(e);
            throw e;
        }
        return -1;
    }
};