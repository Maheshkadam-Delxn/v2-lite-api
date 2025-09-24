import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
    name:{
        type:String,

    },
    unitType:{
        type:String,
        enum:["Material","Formulation"]
    },
    status:{
        type:Boolean,
        default:true
    }
})

export default mongoose.models.Unit || mongoose.model("Unit",unitSchema);