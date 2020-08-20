const TripServices = require("../services/TripServices");
const CustomerServices = require("../services/CustomerServices");
const db = require("../models");
const Trips = db.Trip;
module.exports = {
    insertTrip: async (req, res) => {

        /**
         * customer_name:String,
         description: String,
         from_point: String,
         to_point: String,
         from_lng: String,
         to_lat: String,
         status: String,
         mobile: String,
         max_driver_for_capture:Number,
         */
        if (!req.body) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        try {
            let customer = await CustomerServices.get(req.auth_info.data._id);
            if(!customer){
                throw new Error("Customer Not Exists");
            }
            let tripModel = new Trips(req.body);
            tripModel.customer_name = customer.name;
            tripModel.customer_id = customer._id.toString();
            tripModel.mobile = customer.mobile;
            let tripInsert = await TripServices.createNewTrip(tripModel);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": tripInsert
            });
        }catch (e){
            console.log(e);
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    ///////////////////////////
    ///////////////////////////
    getTripOfDiver: async (req, res) => {
        if (!req.body) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        let driverHashId = req.body.driverHashId;
        let tripHashId = req.body.tripHashId;
        if (driverHashId == undefined || driverHashId.length == 0 || tripHashId == undefined || tripHashId.length == 0) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        let tripOfDriver = await Trip.findById(tripHashId);
        if (tripOfDriver == null) {
            res.send({'status': 'ERROR', 'message': 'Trip not exists'})
            return;
        }
        if (tripOfDriver.driverId_for_capture === "") {
            res.send({'status': 'ERROR', 'message': 'Bạn chưa nhận quốc xe này'})
            return;
        }
        if (tripOfDriver.driverId_for_capture != driverHashId) {
            res.send({'status': 'ERROR', 'message': 'Quốc xe này đã được nhận bởi tài xế khác'})
            return;
        } else {
            res.send({
                "status": "OK",
                "message": "Login successfull",
                "payload": tripOfDriver
            });
        }
    },
    ///////////////////////////
    ///////////////////////////
    getTripById: async (req, res) => {
        let tripOfDriver = await TripServices.getById(req.params.tripId);
        if (tripOfDriver == null) {
            res.send({'status': 'ERROR', 'message': 'Trip not exists'})
            return;
        } else {
            res.send({
                "status": "OK",
                "message": "Login successfull",
                "payload": tripOfDriver
            });
        }
    }
}