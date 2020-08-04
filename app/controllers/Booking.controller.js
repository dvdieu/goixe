const BookingServices = require("../services/BookingServices");
module.exports={
    startTrip:async (req,res)=>{

    },
    finishTrip:async (req,res)=>{

    },
    cancelTrip:async (req,res)=>{

    },
    catchTrip: async (req,res)=>{
        try {

            let driverId = req.auth_info.data._id;
            let status = await BookingServices.catchTrip(driverId, req.params.tripId);
            if(status>0) {
                res.send({
                    "status": "OK",
                    "message": "successfull"
                });
            }else {
                res.send({
                    "status": "ERROR",
                    "message": "Login Error",
                    "payload":{"status":status}
                });
            }
        }
        catch (e){
            res.send({
                "status": "ERROR",
                "message": "Login Error"
            });
        }
    }
}