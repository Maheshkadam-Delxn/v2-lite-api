import mongoose from "mongoose";


const reminderSchema = new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    subject:{
        type:String
    },
    module:{
        type:String,
        required:true 
    },
    actionType:{
        type:String,
        enum:["create","update","complete"],
        required:true
    },
    alertType:{
        sms:{type:Boolean,default:false},
        email:{type:Boolean,default:false},
        notification:{type:Boolean,default:false}
    },
    message:{
        type:String
    },
    selectTime:{
        type:String
    },
    sendTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member",
        required:true
    },
    attribute:{
        type:Map,
        of:String
    },
    receiverEmail:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.models.Reminder || mongoose.model('Reminder',reminderSchema);