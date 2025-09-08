import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    departmentName:{
        type:String,
        unique:true
    }
});

export default mongoose.models.Department || mongoose.model('Department',departmentSchema);