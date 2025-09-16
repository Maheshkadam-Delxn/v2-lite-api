import mongoose from "mongoose";

const snapReportSchema = new mongoose.Schema({
    snagId:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String
    },
    dateOfChecking:{
        type:Date 
    },
    drawingReference:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Drawing"
    },
    status:{
        type:String
    },
    reportedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    resposibleParty:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Member"
    },
    description:{
        type:String
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }
});

export default mongoose.models.SnagReport || mongoose.model('SnagReport',snapReportSchema);