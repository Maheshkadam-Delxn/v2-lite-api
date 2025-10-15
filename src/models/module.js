import mongoose, { Schema } from "mongoose";

const moduleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true 
    } 
})

export default mongoose.models.Module || mongoose.model("Module",moduleSchema);