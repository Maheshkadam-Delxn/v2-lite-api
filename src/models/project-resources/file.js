import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    revision:{
        type:String 
    },
    version:{
        type:String 
    },
    dueDate:{
        type:Date,
        required:true 
    },
    assignTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    status:{
        type:String 
    },
    attachment:{
        name:{type:String},
        path:{type:String}
    }
})

export default mongoose.models.File || mongoose.model("File",fileSchema);