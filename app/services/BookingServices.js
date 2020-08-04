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
                return 1; //Đã Nhận
            }
            if (redis.setnx(bookingKey, driverId)) {
                let driver = await driverServices.DriverServices.updateOnCatch(driverId, tripId);
                if(driver){
                    let trip = await tripServices.acceptTrip(tripId, driverId);
                    let payload = {"driver": driver, "trip": trip};
                    await WorkerTrip.jobHasBeenReceived(payload);
                    return 1;
                }
                else {
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
    }
};