import mongoose from "mongoose";

const BOQItemSchema = new mongoose.Schema({
    boqName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"BOQ",
        required:true
    },
    itemNo:{
        type:String,
        required:true 
    },
    quantity:{
        type:Number,
        required:true 
    },
    unitCost:{
        type:Number,
        required:true 
    },
    unit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"unit"
    },
    phase:{
        type:String 
    },
    total:{
        type:Number,
        required:true 
    },
    contractorLabourRate:{
        type:Number
    },
    description:{
        type:String,
        required:true 
    },
    remark:{
        type:String 
    }
},{timestamps:true});

export default mongoose.models.BOQItem || mongoose.model("BOQItem",BOQItemSchema);
