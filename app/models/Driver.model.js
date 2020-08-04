module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            driver_name:{type:String,default:""},
            user_name:{type:String,default:"",index: {unique: true},required:true,lowercase: true},
            password:{type:String,default:"",required:true},
            car_no:{type:String,default:""},
            car_type:{type:String,default:""},
            mobile:{type:String,default:""},
            email:{type:String,default:""},
            address:{type:String,default:""},
            image:{type:String,default:""},
            location: {
                type: { type: String },
                coordinates: []
            },
            direction:{type:Number,default:0},
            velocity:{type:Number,default:0},
            radius:{type:Number,default:0},
            status:{type:String,default:"on",enum:["off","oncatch","on"]},
            in_trip_id:{type:String,default:""},
            auth_id:{type:String,default:""}
        },
        {timestamps: true}
    );
    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });
    schema.index({ location: '2dsphere' });
    const Driver = mongoose.model("driver", schema);
    return Driver;
};