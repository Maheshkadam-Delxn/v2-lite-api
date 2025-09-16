import mongoose from "mongoose";

const addDeductionSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:["penalty","delay"],
        required:true 
    },
    amount:{
        type:Number
    },
    remark:{
        type:String 
    }
});

const billSchema = new mongoose.Schema({
    billNo:{
        type:String,
        required:true,
        unique:true 
    },
    workOrder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"WorkOrder",
    },
    advancePayment:{
        type:String,
    },
    remark:{
        type:String 
    },
    taxPercentage:{
        type:Number
    },
    retantionAmount:{
        type:Number
    },
    netPayment:{
        type:Number
    },
    deductionAmount:{
        type:String
    },
    items:[addDeductionSchema],
    projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
    }

});

export default mongoose.models.Bill || mongoose.model('Bill',billSchema);