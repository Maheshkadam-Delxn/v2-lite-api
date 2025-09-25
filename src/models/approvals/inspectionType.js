import mongoose from "mongoose";

const inspectionTypeSchema = new mongoose.Schema({
    title:{
        type:String,
        unique:true 
    }
});

export default mongoose.models.InspectionType || mongoose.model("InspectionType",inspectionTypeSchema);