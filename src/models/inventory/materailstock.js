import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    caterory:{
        type:true 
    },
    material:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Material"
    },
    name:{
        type:String 
    },
    unit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Unit"
    },
    assumedCost:{
        type:Number 
    },
    quantity:{
        type:Number 
    },
    leadDays:{
        type:Number
    },
    materialCode:{
        type:String,
        unique:true
    },
    status:{
        type:Boolean,
        default:true
    },
    usageAlert:{
        type:Number 
    },
    description:{
        type:String 
    },
    file:{
        name:{type:String},
        path:{type:String}
    }
},{timestamps:true})

export default mongoose.models.MaterialStock || mongoose.model("MaterialStock",stockSchema);