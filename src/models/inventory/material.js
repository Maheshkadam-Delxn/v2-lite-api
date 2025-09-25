import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    unit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Unit"
    },
    code:{
        type:String,
        unique:true 
    },
    name:{
        type:String 
    },
    price:{
        type:Number
    },
    HSNCode:{
        type:String,
        unique:true 
    }
})

export default mongoose.models.Material || mongoose.model("Material",materialSchema);