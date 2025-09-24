import mongoose from "mongoose";

const RFISchema = new mongoose.Schema({
    referenceNo:{
        type:String,
        unique:true 
    },
    title:{
        type:String 
    },
    revision:{
        type:String
    },
    toUser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member" 
    }],
    replyDate:{
        type:Date,

    },
    priority:{
        type:String
    },
    timeImpact:{
        type:Boolean,
        default:false 
    },
    costImpact:{
        type:Boolean,
        default:false
    },
    status:{
        type:String
    },
    category:{
        type:String
    },
    previousRFI:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RFI"
    },
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
},{timestamps:true})

export default mongoose.models.RFI || mongoose.model("RFI",RFISchema);