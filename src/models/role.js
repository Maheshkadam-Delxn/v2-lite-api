import mongoose from "mongoose";


const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    keyName:{
        type:String,
        required:true,
        unique:true 
    }
});


export default mongoose.models.Role || mongoose.model('Role',roleSchema);