const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema({
    path:{
        type:String,
        required:[true,"Path required"],
        unique:true,
    },
    filename : {
        type:String,
        required:[true,"File name required"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DriveUsers",
        required:[true,"User required"],
    }
});

const fileModel = mongoose.model("DriveFile", fileSchema);

module.exports = fileModel;