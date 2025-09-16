import mongoose from "mongoose";

const BOQSchema = new mongoose.Schema({
    name:{
        type:String
    },
    type:{
        type:String,
        enum:["fixed","variable"]
    },
    category:{
        type:String,
    },
    sharedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    description:{
        type:String
    },
    projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
},{timestamps:true})

export default mongoose.models.BOQ || mongoose.model('BOQ',BOQSchema);