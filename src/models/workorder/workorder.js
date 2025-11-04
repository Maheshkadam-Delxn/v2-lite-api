import mongoose from "mongoose";



const WorkOrderItemSchema = new mongoose.Schema({
    workOrderType:{ 
        type:String,
        enum:["BOQ","Non-BOQ"],
    
    },
    boqref:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"BOQ",
        required:function(){
            return this.workOrderType === "BOQ";
        }
    },

    itemNo:{type:String},
    unit:{type:String},
    rate:{type:Number,default:0},
    quantity:{type:Number,default:0},
    total:{type:Number,default:0}
},{_id:false});

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
        type:Date,
        default:Date.now()
    },
    retentionPercentage:{
        type:Number,
        default:0
    },
    taxPercentage:{
        type:Number,
        default:0
    },
    retentionAmount:{
        type:Number,
        default:0
    },
    taxAmount:{
        type:Number,
        default:0
    },
    paidAmount:{
        type:Number,
        default:0 
    },
    netPayable:{
        type:Number,
        default:0 
    },
    advancePayment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AdvancePayment"
    },
    termsCondition:{
        type:String 
    },

    items:[WorkOrderItemSchema],
    projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
    }
},{timestamps:true});


export default mongoose.models.WorkOrder || mongoose.model("WorkOrder",WorkOrderSchema);