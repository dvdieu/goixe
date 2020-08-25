const driverServices = require("../services/DriverServices");
const tripServices = require("../services/TripServices");
module.exports = {
    list_driver_on_catch: async (req, res) => {
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
                    payload: new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload: new Array()
            });
        }
    },
    list_driver_near_trip: async (req, res) => {
        try {
            let user = await driverServices.nearAll(req.params.long, req.params.lat, req.params.km);
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
                    payload: new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload: new Array()
            });
        }
    },
    list_driver_off: async (req, res) => {
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
                    payload: new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload: new Array()
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
                    payload: new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload: new Array()
            });
        }
    },

    list_trips: async (req, res) => {
        try {
            let page = req.params.page;
            let size = req.params.size;
            let status = req.body.status;
            let dateFrom = req.body.from;
            let dateTo = req.body.to;
            let listTrip = await tripServices.listTrip(status, dateFrom, dateTo, page, size);
            if (listTrip) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": listTrip
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "",
                    payload: new Array()
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": "",
                payload: new Array()
            });
        }
    },
    async findTrip(req, res) {
        try {
            let tripID = req.params.tripId;
            let trip = await tripServices.getById(tripID);
            if (trip) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": trip
                });
            } else {
                res.send({
                    "status": "ERROR",
                    "message": "",
                });
            }
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": ""
            });
        }
    },
    async carTypes(req, res) {
        try {
            let listCarType = [
                {
                    "group": "TAXI",
                    "capacity": 7,
                    "display_name":"TAXI",
                    "description":"Không gian lớn, thích hợp cho nhóm"
                },
                {
                    "group": "TAXI",
                    "capacity": 4,
                    "display_name":"TAXI",
                    "description":"Không gian tối ưu"
                },
                {
                    "group": "SUV",
                    "capacity": 5,
                    "display_name":"SUV",
                    "description":"Sang trọng như ở nhà"
                },
                {
                    "group": "SUV",
                    "capacity": 7,
                    "display_name":"SUV",
                    "description":"Sang trọng như ở nhà"
               },
                {
                    "group": "SHARE",
                    "capacity": 2,
                    "display_name":"",
                    "description":"Chia sẻ chuyến đi, chia nhỏ chi phí"
                },
            ];
            res.send({
                "status": "ERROR",
                "message": "",
                "payload": listCarType
            });
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": ""
            });
        }
    },
}