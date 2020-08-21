module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            user_name:{type:String,default:"",index: {unique: true},required:true,lowercase: true},
            name:{type:String,default:"",index: {unique: true},required:true,lowercase: false},
            password:{type:String,default:"",required:true},
            mobile:{type:String,default:""},
            email:{type:String,default:""},
            address:{type:String,default:""},
            image:{type:String,default:""},
        },
        {timestamps: true}
    );
    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });
    const Agents = mongoose.model("agents", schema);
    return Agents;
};