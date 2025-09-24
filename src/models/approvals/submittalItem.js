import mongoose from "mongoose";

const submittalItem = new mongoose.Schema({
    submittalNo:{
        type:String,
        unique:true 
    },
    title:{
        type:String 
    },
    drawingNo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Drawing"
    },
    revision:{
        type:String 
    },
    discipline:{
        type:String 
    },
    location:{
        type:String
    },
    actualDate:{
        type:Date 
    },
    expectedDate:{
        type:Date 
    },
    status:{
        type:String 
    },
    discription:{
        type:String
    },
    attachment:{
        name:{type:String},
        path:{type:String}
    }
},{timestamps:true})

export default mongoose.models.SubmittalItem || mongoose.model("SubmittalItem",submittalItem);