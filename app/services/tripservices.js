const db = require("../models");
const publishEvent = require("../redis/pub");
const Trip = db.Trip;
class TripServices {
    constructor() {
    }
    static async createNewTrip(tripPayload){
        try {
            let newTrip = await Trip.create(new Trip(tripPayload));
            publishEvent.publish("new-trip",newTrip.toJSON())
            return newTrip;
        }
        catch (e) {
            throw e
        }
        return false;
    }
    static getById(id){
        try {
            return Trip.findById(id);
        }
        catch (e) {
            throw e
        }
        return false;
    }
}

module.exports = {TripServices};