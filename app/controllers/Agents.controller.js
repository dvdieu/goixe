const db = require("../models");
const Agents = db.Agents;
const Trips = db.Trips;
const agentServices = require("../services/AgentsServices")
const ErrorApp = require("../ErrorCode")
const TripServices = require("../services/TripServices");
module.exports = {
    register: async (req, res) => {
        // Validate request
        if (!req.body) {
            res.status(400).send({message: "Content can not be empty!"});
            return;
        }
        try {
            let agents = await agentServices.create(new Agents(req.body)).catch(err => {
                if (err.code === 11000) {
                    throw new Error("EXISTS")
                }
                throw err;
            });
            if (agents)
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload": agents
                });
            throw Error("ERROR");
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    login: async (req, res) => {
        try {
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
            let token = await agentServices.login(userName, passWord);
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
        } catch (e) {
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    me: async (req, res) => {
        try {
            let user = await agentServices.get(req.auth_info.data._id);
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
            let agent = await agentServices.get(req.auth_info.data._id);
            if (!agent) {
                throw new Error("Customer Not Exists");
            }
            let tripModel = new Trips(req.body);
            tripModel.agent_id = agent._id.toString();
            tripModel.trip_type="default";
            tripModel.mobile = agent.mobile;
            let tripInsert = await TripServices.createNewTrip(tripModel);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload": tripInsert
            });
        } catch (e) {
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