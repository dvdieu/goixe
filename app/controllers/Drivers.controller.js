const driverServices = require("../services/DriverServices");
const BookingServices = require("../services/BookingServices");
const db = require("../models");
const Driver = db.Driver;
const ErrorApp = require("../ErrorCode")
const ROUTERCONST = require("../RouterConst");
const e = require("express");
function payment(km){
    let giaMoCua=10000;
    let NGUONG_1=1;
    let NGUONG_2 = 31;
    let GIA_1=13600;
    let GIA_2=11000;
    if(km<=NGUONG_1){
        return giaMoCua + (km*GIA_1);
    }
    else{
        if(km<=NGUONG_2){
            return giaMoCua + (km*GIA_1) + (km-NGUONG_1)*GIA_2;
        }
        else{
            return giaMoCua + (km*GIA_1) + (km-NGUONG_1)*GIA_2;
        }
    }
};
module.exports = {
    register: async (req, res) => {
        // Validate request
        if (!req.body) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        try {
            let driverRequest = new Driver(req.body)
            let driver = await driverServices.createNewDriver(driverRequest).catch(err => {
                if (err.code === 11000) {
                    throw new Error(ErrorApp.DRIVER_EXISTS);
                }
            });
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": driver
            });
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    login: async (req, res) => {
        if (!req.body) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        let userName = req.body.user_name;
        let passWord = req.body.password;
        if (userName == undefined || userName.length == 0 || passWord == undefined || passWord.length == 0) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        let token = await driverServices.loginDriver(userName, passWord);
        if (token != null) {

            res.send({
                "status": "OK",
                "message": "Login successfull",
                "token": token.toString()
            });
        } else {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    me: async (req, res) => {
        try {
            let user = await driverServices.get(req.auth_info.data._id);
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    meUpdate: async (req, res) => {
        try {
            let user = await driverServices.get(req.auth_info.data._id);
            let infoUpdate = {
                driver_name:((req.body.driver_name === undefined || req.body.driver_name ===null) ? user.driver_name: req.body.driver_name),
                mobile:((req.body.mobile === undefined || req.body.mobile ===null) ? user.mobile: req.body.mobile),
                address:((req.body.address === undefined || req.body.address ===null) ? user.address: req.body.address),
                email:((req.body.email === undefined || req.body.email ===null) ? user.email: req.body.email),
                image:((req.body.image === undefined || req.body.image ===null) ? user.image: req.body.image),
            }
            let userAfterUpdate = await driverServices.updateDriver(req.auth_info.data._id,infoUpdate);
            if (userAfterUpdate) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": userAfterUpdate
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    updatePassword: async (req, res) => {
        try {
            let user = await driverServices.get(req.auth_info.data._id);
            let infoUpdate = {
                password:((req.body.password === undefined || req.body.password ===null) ? user.password: req.body.password)
            }
            let userAfterUpdate = await driverServices.updateDriver(req.auth_info.data._id,infoUpdate);
            if (userAfterUpdate) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": userAfterUpdate
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    updateCarType: async (req, res) => {
        try {
            let user = await driverServices.get(req.auth_info.data._id);
            let infoUpdate = {
                car_type:((req.body.car_type === undefined || req.body.car_type ===null) ? user.car_type: req.body.car_type),
                car_no:((req.body.car_no === undefined || req.body.car_no ===null) ? user.car_no: req.body.car_no)
            }
            let userAfterUpdate = await driverServices.updateDriver(req.auth_info.data._id,infoUpdate);
            if (userAfterUpdate) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": userAfterUpdate
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    historyTripsFinish: async (req, res) => {
        try {
            let page = req.params.page;
            let size = req.params.size;
            let dateFrom = req.body.from;
            let dateTo = req.body.to;
            let historyFinish =await BookingServices.historyFinishOnFinish(req.auth_info.data._id,dateFrom,dateTo,page,size);
            if (historyFinish) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": historyFinish
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    historyTripsCancel: async (req, res) => {
        try {
            let page = req.params.page;
            let size = req.params.size;
            let dateFrom = req.body.from;
            let dateTo = req.body.to;
            let historyFinish =await BookingServices.historyFinishOnCancel(req.auth_info.data._id,dateFrom,dateTo,page,size);
            if (historyFinish) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": historyFinish
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    details: async (req, res) => {
        try {
            let user = await driverServices.get(req.params.id);
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    gps: async (req, res) => {
        try {
            let user = await driverServices.updateGPS(req.auth_info.data._id, req.body.long, req.body.lat, req.body.direction, req.body.velocity, req.body.radius);
            global.io.of(ROUTERCONST.AGENTS.base_url).emit("gps",{
                "status": "OK",
                "message": "successfull",
                "payload": user
            });
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error"
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    },
    on: async (req, res) => {
        try {
            let user = await driverServices.onDriver(req.auth_info.data._id);
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": ""
                });
            } else {
                let driver = await driverServices.get(req.auth_info.data._id);
                if (driver == null) {
                    res.send({
                        "status": "ERROR",
                        "message": "Driver Not Exists"
                    });
                    return;
                }
                if (driver) {
                    if (driver.status === "oncatch") {
                        throw Error(ErrorApp.YOU_HAVE_NOT_COMPLETED_THE_PREVIOUS_TRIP);
                    }
                }

            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    off: async (req, res) => {
        try {
            let user = await driverServices.offDriver(req.auth_info.data._id);
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                let driver = await driverServices.get(req.auth_info.data._id);
                if (driver == null) {
                    res.send({
                        "status": "ERROR",
                        "message": "Driver Not Exists"
                    });
                    return;
                }
                if (driver) {
                    if (driver.status === "oncatch") {
                        throw Error(ErrorApp.YOU_HAVE_NOT_COMPLETED_THE_PREVIOUS_TRIP);
                    }
                }
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    async inCharge(req, res) {
        try {
            let trip = await BookingServices.inCharge(req.auth_info.data._id);
            if (trip) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": trip
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": ErrorApp.YOU_NOT_OWNER_TRIP
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "Error"
            });
        }
    },
    goAgents: async (req, res) => {
        try {
            let tripID = req.params.tripId;
            let driverId = req.auth_info.data._id;
            let trip = await BookingServices.gotoCustomers(driverId, tripID);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": trip
            });
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    finishTrip: async (req, res) => {
        try {
            let tripID = req.params.tripId;
            let driverId = req.auth_info.data._id;
            let status = await BookingServices.finishTrip(driverId, tripID);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": status
            });
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    cancelTrip: async (req, res) => {
        try {
            let driverId = req.auth_info.data._id;
            let status = await BookingServices.cancelTrip(driverId, req.params.tripId);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": status
            });
        } catch (e) {
            console.log(e);
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    catchTrip: async (req, res) => {
        try {

            let driverId = req.auth_info.data._id;
            let payload = await BookingServices.catchTrip(driverId, req.params.tripId);
            if (payload) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": payload
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error",
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    async go(req, res) {
        try {
            let tripID = req.params.tripId;
            let driverId = req.auth_info.data._id;
            let status = await BookingServices.go(driverId, tripID);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": status
            });
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    async charge(req, res) {
        try {
            let km = req.params.km;
            let price = payment(km);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": price
            });

        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    
}