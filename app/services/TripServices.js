const db = require("../models");
const publishEvent = require("../redis/pub");
const Trip = db.Trip;
module.exports={
    async createNewTrip(payload){
        try {
            let newTrip = await Trip.create(new Trip(payload));
            publishEvent.publish("new-trip",newTrip.toJSON())
            return newTrip;
        }
        catch (e) {
            throw e
        }
        return false;
    },
    async getById(tripId){
        try {
            return Trip.findById(tripId);
        }
        catch (e) {
            throw e
        }
        return false;
    },
    async cancelTrip(tripId,driverId){
        try {

        }
        catch (e){

        }
    },
    async acceptTrip(tripId,driverId){
        try {
            return Trip.findOneAndUpdate({"_id":tripId},{"driverId_in_trip":driverId,"status":"initial"},{
                new:true
            });
        }
        catch (e){

        }
    }
}