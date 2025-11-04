import mongoose, { Schema } from "mongoose";

const moduleDemoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true 
    } 
})

export default mongoose.models.ModuleDemo || mongoose.model("ModuleDemo",moduleDemoSchema);