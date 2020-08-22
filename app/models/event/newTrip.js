module.exports = {
    newTrip(tripId){
        return {
            "type":"trips",
            "action":"new",
            "id":tripId
        }
    }
}