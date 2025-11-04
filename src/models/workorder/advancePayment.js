import mongoose from "mongoose";


const advancePaymentSchema = new mongoose.Schema({
    paymentNo:{
        type:String,
        unique:true 
    },
    paymentStatus:{
        type:String,
        required:true 
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor"
    },
    workOrder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"WorkOrder"
    },
    amount:{
        type:Number
    },
    advanceDate:{
        type:Date 
    },
    remark:{
        type:String
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project" 
    },
    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member",
        default:null 
    },
    approvedAt:{
        type:Date,
        default:null 
    }
},{timestamps:true})

export default mongoose.models.AdvancePayment || mongoose.model("AdvancePayment",advancePaymentSchema);