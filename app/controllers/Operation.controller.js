const driverServices = require("../services/DriverServices").DriverServices;
module.exports = {
    list_driver_on_catch: async (req, res)=>{
        try {
            let user = await driverServices.list_driver_on_catch();
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "",
                    payload:new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload:new Array()
            });
        }
    },
    list_driver_near_trip: async (req, res)=>{
        try {
            let user = await driverServices.nearAll(req.params.long,req.params.lat,req.params.km);
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "",
                    payload:new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload:new Array()
            });
        }
    },
    list_driver_off: async (req, res)=>{
        try {
            let user = await driverServices.list_driver_off();
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "",
                    payload:new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload:new Array()
            });
        }
    },
    list_driver_on: async (req, res) => {
        try {
            let user = await driverServices.list_driver_on();
            if (user) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": user
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "",
                    payload:new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload:new Array()
            });
        }
    }

}