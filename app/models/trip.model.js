module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            customer_name:{type:String,default:""},
            trip_type:{type:String,default:""},
            car_type:{type:String,default:""},
            description: {type:String,default:""},
            from_point: {type:String,default:""},
            to_point: {type:String,default:""},
            from_lng: {type:Number,default:0.0},
            from_lat: {type:Number,default:0.0},
            to_lng: {type:Number,default:0.0},
            to_lat: {type:Number,default:0.0},
            status: {type:String,default:""},
            mobile: {type:String,default:""},
            max_driver_for_capture:{type:Number,default:0.0},
            schedule_time:{type:Number,default:0.0},
            from_time:{type:Date,default:Date.now()},
            to_time:{type:Date,default:Date.now()},
            kmgps:{type:String,default:""},
            time:{type:Date,default:Date.now()},
            amount:{type:Number,default:0.0},
            created_date:{type:Date,default:Date.now()},
            driverId_in_trip:{type:String,default:""},
            driverId_for_capture:{type:String,default:""},
            driverId_for_excluded:{type:Array,default:[]}
        },
        {timestamps: true}
    );

    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    const Trip = mongoose.model("trip", schema);
    return Trip;
};