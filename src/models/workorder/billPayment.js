import mongoose from "mongoose";

const workOrderBillPayment = new mongoose.Schema({
    billNo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bill"
    },
    paymentMode:{
        type:String,
        required:true 
    },
    transactionNo:{
        type:String,
        unique:true,
        require:true 
    },
    paidAmount:{
        type:Number
    },
    paymentDate:{
        type:Date,

    },
    remark:{
        type:String 
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project" 
    }
},{timestamps:true});

export default mongoose.models.WOBillPayment || mongoose.model("WOBillPayment",workOrderBillPayment);