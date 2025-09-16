import mongoose from "mongoose";


const WorkOrderItemSchema = new mongoose.Schema({
    workOrderType:{
        type:String,
        enum:["BOQ","Non-BOQ"],
    
    },
    boqref:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"BOQ"
    },

    itemNo:{type:String},
    unit:{type:String},
    rate:{type:Number},
    quantity:{type:Number},
    total:{type:Number}
});

const WorkOrderSchema = new mongoose.Schema({
    workOrderNo:{
        type:String,
        required:true,
        unique:true
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor"
    },
    date:{
        type:String,

    },
    retentionPercentage:{
        type:Number,
        default:0
    },
    taxPercentage:{
        type:Number,
        default:0
    },
    advancePayment:{
        type:Number
    },
    termsCondition:{
        type:String 
    },

    items:[WorkOrderItemSchema],
    projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
    }
});


export default mongoose.models.WorkOrder || mongoose.model("WorkOrder",WorkOrderSchema);