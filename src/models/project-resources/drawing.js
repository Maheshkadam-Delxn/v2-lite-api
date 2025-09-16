import mongoose from "mongoose";

const drawSchema = new mongoose.Schema({
    group:{
        type:String
    },
    title:{
        type:String
    },
    drawingNumber:{
        type:String,
        required:true 
    },
    revision:{
        type:String
    },
    category:{
        type:String,
        enum:["general","structural"]
    },
    status:{
        type:String
    },
    type:{
        type:String
    },
    remark:{
        type:String
    },
    description:{
        type:String
    },
    file:{
        name:{type:String},
        path:{type:String}
    },
    projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
})

export default mongoose.models.Drawing || mongoose.model('Drawing',drawSchema);