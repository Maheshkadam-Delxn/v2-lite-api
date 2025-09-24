import mongoose from "mongoose";

const submittalTypeSchema = new mongoose.Schema({
    title:{
        type:String,
        unique:true 
    }
});

export default mongoose.models.SubmittalType || mongoose.model("SubmittalType",submittalTypeSchema);