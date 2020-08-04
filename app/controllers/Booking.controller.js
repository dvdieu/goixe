const BookingServices = require("../services/BookingServices");
module.exports={
    goCustomer:async (req, res)=>{
        try {
            let tripID = req.params.tripId;
            let driverId = req.auth_info.data._id;
            let trip= await BookingServices.goToCustomers(driverId,tripID);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload":trip
            });
        }
        catch (e){
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    finishTrip:async (req,res)=>{
        try {
            let tripID = req.params.tripId;
            let driverId = req.auth_info.data._id;
            let status = await BookingServices.finishTrip(driverId,tripID);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload":status
            });
        }
        catch (e){
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    cancelTrip:async (req,res)=>{
        try{
            let driverId = req.auth_info.data._id;
            let status = await BookingServices.cancelTrip(driverId, req.params.tripId);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload":status
            });
        }
        catch (e){
            console.log(e);
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    catchTrip: async (req,res)=>{
        try {

            let driverId = req.auth_info.data._id;
            let payload = await BookingServices.catchTrip(driverId, req.params.tripId);
            if(payload) {
                res.send({
                    "status": "OK",
                    "message": "successfull",
                    "payload":payload
                });
            }else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error",
                });
            }
        }
        catch (e){
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    },
    async go(req,res) {
        try {
            let tripID = req.params.tripId;
            let driverId = req.auth_info.data._id;
            let status = await BookingServices.go(driverId,tripID);
            res.send({
                "status": "OK",
                "message": "successfull",
                "payload":status
            });
        }
        catch (e){
            res.send({
                "status": "ERROR",
                "message": e.message
            });
        }
    }
}