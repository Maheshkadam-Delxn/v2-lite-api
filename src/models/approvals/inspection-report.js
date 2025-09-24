import mongoose from "mongoose";

const inspectionReportSchema = new mongoose.Schema({
    inspectionType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"InspectionType"
    },
    category:{
        type:String 
    },
    referencNo:{
        type:String,
        unique:true 
    },
    title:{
        type:String 
    },
    revision:{
        type:String
    },
    raisedDate:{
        type:Date 
    },
    raisedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    raisedTo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Member"
        }
    ],
    checkList:{
        type:String,
        required:true 
    },
    status:{
        type:String
    },
    description:{
        type:String
    },
    attachment:{
        name:{type:String},
        path:{type:String}
    }
},{timestamps:true});

export default mongoose.models.InspectionReport || mongoose.model("InspectionReport",inspectionReportSchema);