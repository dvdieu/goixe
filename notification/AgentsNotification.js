const RedisWrapper = require('../app/redis/RedisWrapper');
const driverServices = require("../app/services/DriverServices")
const tripServices = require("../app/services/TripServices")
const ROUTERCONST = require("../app/RouterConst");
const SocketDataBase = require("../app/persistence/SocketDataBase");
module.exports = {
    async jobHasBeenCancel(tripId, driverId) {
        try {
            let result = await tripServices.driverCancelTrip(tripId, driverId);
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async notifyOnDriverGoToCustomer(customerId, data) {
        try {
            let message = {"status": "OK", "message": "Tài xế đang tới chỗ bạn", "payload": data};

            console.log("goAgents" + JSON.stringify(message));
            let socketID = await SocketDataBase.getSocket(SocketDataBase.dataBaseNameAgentsOnline(), customerId)
            if (socketID) {
                await global.io.of(ROUTERCONST.AGENTS.base_url).to(socketID).emit("goCustomer", JSON.stringify(message));
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async notifyOnStartTrip(customerId, data) {
        try {
            let message = {
                "status": "OK",
                "message": "Bạn đang trong chuyến đi, chúc thượng lộ bình an",
                "payload": data
            };
            console.log("startTrip" + JSON.stringify(message));
            let socketID = await SocketDataBase.getSocket(SocketDataBase.dataBaseNameAgentsOnline(), customerId)
            if (socketID) {
                global.io.of(ROUTERCONST.AGENTS.base_url).to(socketID).emit("startTrip", JSON.stringify(message));
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async notifyOnFinishTrip(customerId, data) {
        try {
            let message = {
                "status": "OK",
                "message": "Cảm ơn bạn đã lựa chọn chúng tôi! Xin chào, hẹn gặp lại",
                "payload": data
            };
            console.log("finishTrip" + JSON.stringify(message));
            let socketID = await SocketDataBase.getSocket(SocketDataBase.dataBaseNameAgentsOnline(), customerId)
            if (socketID) {
                await global.io.of(ROUTERCONST.AGENTS.base_url).to(socketID).emit("finishTrip", JSON.stringify(message));
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async notifyOnDriverCatchTrip(customerId, data) {
        try {
            let message = {"status": "OK", "message": "Tài xế đã nhận cuốc xe của bạn", "payload": data};
            console.log("catchTrip" + JSON.stringify(message));
            let socketID = await SocketDataBase.getSocket(SocketDataBase.dataBaseNameAgentsOnline(), customerId)
            if (socketID) {
                await global.io.of(ROUTERCONST.AGENTS.base_url).to(socketID).emit("catchTrip", JSON.stringify(message));
            }
            // global.io.of("/clients").emit("catchTrip",JSON.stringify(message));
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async notifyWhenNewTripCreate(message) {
        try {
            let data = JSON.parse(message);
            let tripId = data.id;
            let lat = data.from_lat;
            let long = data.from_lng;
            let listDriver = await driverServices.near(long, lat, 10);//10
            if (listDriver === null || listDriver === undefined || listDriver.length === 0) {
                //global.io.of("client").emit("");
                //Tất cả tài xế đang bận
                let payload = {
                    "status": "ERROR",
                    "message": "Tất cả tài xế đang bận",
                    "payload": {},
                }
                await global.io.of("/managers").emit("catchTrip", JSON.stringify(payload));
                return;
            }
            let listDriverNear = listDriver.map(function (item) {
                return item._id.toString();
            });
            let listDriverOnline = await RedisWrapper.crud.hmget(SocketDataBase.dataBaseNameDriverOnline(), listDriverNear);
            if (listDriverOnline != null && listDriverOnline.length > 0) {
                listDriverOnline.forEach(async function (item) {
                    await RedisWrapper.crud.hset(tripId, item, item);
                });
                let trip = await tripServices.getById(tripId);
                let payload = {
                    "status": "OK",
                    "message": "",
                    "payload": trip
                };
                listDriverOnline.forEach((v, k) => {
                    if (v) {
                        global.io.of(ROUTERCONST.DRIVERS.base_url).to(v).emit("catchTrip", JSON.stringify(payload));
                    }
                });
            } else {
                let data = {
                    "status": "ERROR",
                    "message": "DRIVER OUT RANGE OR NOT ONLINE"
                }
                console.log("catchTrip" + data);
                await global.io.of("/clients").emit("catchTrip", JSON.stringify(data));
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
