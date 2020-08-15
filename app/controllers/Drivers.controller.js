const driverServices = require("../services/DriverServices").DriverServices;
const BookingServices = require("../services/BookingServices");
const db = require("../models");
const Driver = db.Driver;
const ErrorApp = require("../ErrorCode")
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
                    res.status(500).send({
                        message: "User exists"
                    });
                    return;
                }
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the FeedBack."
                });
            });
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": driver
            });
        }catch (e){
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
            let user = await driverServices.updateGPS(req.auth_info.data._id,req.body.long,req.body.lat,req.body.direction,req.body.velocity,req.body.radius);
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
                if(driver==null){
                    res.send({
                        "status": "ERROR",
                        "message":"Driver Not Exists"
                    });
                    return;
                }
                if(driver){
                    if(driver.status==="oncatch"){
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
    }
}