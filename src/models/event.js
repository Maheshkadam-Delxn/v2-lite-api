import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    name:{
        type:String,
        required:true 
    },
    module:{
        type:String,
        
    },
    actionType:{
        type:String,
        enum:["created","updated","viewed","completed"],
        //required:true 
    },
    message:{
        type:String,
        trim:true 
    },
    alertType:{
        sms:{type:Boolean,default:false},
        email:{type:Boolean,default:false},
        notification:{type:Boolean,default:false}
    },
    specific:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    attribute:{
        type:Map,
        of:String
    },
    sentTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role"
    },
    status:{
        type:Boolean,
        default:true 
    },
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member"
    }
},{timestamps:true})

export default mongoose.models.Event || mongoose.model("Event",eventSchema);