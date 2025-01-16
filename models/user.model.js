const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
    username :{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:[8,"Password must be at least 8 characters"]
        },  
});

const userModel = mongoose.model("DriveUser", userSchema);
module.exports = userModel;