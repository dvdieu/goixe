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
                    "id":"26546650-e557-4a7b-86e7-6a3942445247",
                    "group": "TAXI",
                    "capacity": 7,
                    "display_name":"TAXI",
                    "description":"Không gian lớn, thích hợp cho nhóm"
                },
                {
                    "id":"a1111c8c-c720-46c3-8534-2fcdd730040d",
                    "group": "TAXI",
                    "capacity": 4,
                    "display_name":"TAXI",
                    "description":"Không gian tối ưu"
                },
                {
                    "id":"821415d8-3bd5-4e27-9604-194e4359a449",
                    "group": "SUV",
                    "capacity": 5,
                    "display_name":"SUV",
                    "description":"Sang trọng như ở nhà"
                },
                {
                    "id":"57c0ff4e-1493-4ef9-a4df-6b961525cf92",
                    "group": "SUV",
                    "capacity": 7,
                    "display_name":"SUV",
                    "description":"Sang trọng như ở nhà"
               },
                {
                    "id":"d4abaae7-f4d6-4152-91cc-77523e8165a4",
                    "group": "SHARE",
                    "capacity": 2,
                    "display_name":"",
                    "description":"Chia sẻ chuyến đi, chia nhỏ chi phí"
                },
            ];
            res.send({
                "status": "OK",
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