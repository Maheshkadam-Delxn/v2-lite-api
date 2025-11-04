import mongoose from "mongoose";

const WBSSchema = new mongoose.Schema({
    parentWBS:{
        type:mongoose.Schema.Types.ObjectId,
    },
    code:{
        type:String,
    },
    groupName:{
        type:String
    },
    
})