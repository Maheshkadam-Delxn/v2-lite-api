import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    wbs:{
        type:String,
        required:true 
    },
    title:{
        type:String
    },
    startDate:{
        type:String
    },
    duration:{
        type:String
    },
    endDate:{
        type:String
    },
    priority:{
        type:String,
        enum:["low","high","medium"]
    },
    assignTo:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
        }
    ],
    description:{
        type:String
    },
    attachment:{
        name:{type:String},
        path:{type:String}
    },
    projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }

},{timestamps:true});

export default mongoose.models.Activity || mongoose.model('Activity',activitySchema);

