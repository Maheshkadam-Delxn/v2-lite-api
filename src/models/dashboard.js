import mongoose from "mongoose";

const dashboardPermissionSchema = new mongoose.Schema({
    project:{
        type:String,
        required:true 
    },
    role:{
        type:String,
        required:true 
    },
    viewType:{
        type:String,
        enum:["counter","graph","table"],
        required:true 
    },
    module:{
        type:String,
        required:true 
    },
    sequenceNo:{
        type:Number,
        required:true 
    }
})

export default mongoose.models.Dashboard || mongoose.model('Dashboard',dashboardPermissionSchema);