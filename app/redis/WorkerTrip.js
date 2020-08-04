const RedisWrapper = require('./RedisWrapper');
const driverServices = require("../services/DriverServices")
const tripServices = require("../services/TripServices")
module.exports={
    async jobHasBeenCancel(tripId,driverId){
        try{
            let result = await tripServices.cancelTrip(tripId,driverId);
        }
        catch (e){
            console.log(e);
            throw e;
        }
    },
    async driverGoToCustomer(data){
        try{
            global.io.of("/clients").emit("goCustomer",JSON.stringify(data));
        }
        catch (e){
            console.log(e);
            throw e;
        }
    },
    async startTrip(data){
        try{
            global.io.of("/clients").emit("startTrip",JSON.stringify(data));
        }
        catch (e){
            console.log(e);
            throw e;
        }
    },
    async jobHasBeenReceived(data){
        try{
            global.io.of("/clients").emit("catchTrip",JSON.stringify(data));
        }
        catch (e){
            console.log(e);
            throw e;
        }
    },
    async createJobFoTheDriver(message){
        try {
            let data = JSON.parse(message);
            let tripId = data.id;
            let lat = data.from_lat;
            let long = data.from_lng;
            let listDriver = await driverServices.DriverServices.near(long, lat, 10);//10
            if (listDriver === null || listDriver === undefined || listDriver.length === 0) {
                //global.io.of("client").emit("");
                //Tất cả tài xế đang bận
                return;
            }
            let listDriverNear = listDriver.map(function (item) {
                return item._id.toString();
            })

            RedisWrapper.crud.hmget("driver_online", listDriverNear, function (err, reply) {
                //Create DataBase Stored For List Diver Near Trip
                reply.forEach(function (value) {
                    RedisWrapper.crud.hset(tripId, value, value);
                })
            });
            RedisWrapper.crud.hgetall(tripId, async function (err,reply){
                let trip = await tripServices.getById(tripId);
                //EMIT SOCKET
                Object.keys(reply).forEach(key => {
                    console.log(key);
                    global.io.of("/drivers").to(key).emit("catchTrip",JSON.stringify(trip));
                });
            });
        }catch (e){
            console.log(e);
            throw e;
        }
    }
}
