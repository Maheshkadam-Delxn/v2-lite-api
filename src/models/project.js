import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String,
        enum:["Residential","Commercial","Industrial","Infrastructure"],
        required:true
    },
    startDate: { type: Date},
    endDate: { type: Date },
    currency:{
        type:String,
        default:"INR"
    },
    zoneOffset:{
        type:String,
        default:"+00:00"
    },
    budget:{
        type:Number,
        required:true,
        min:0
    },
    location:{
        type:String,
    },
    description:{
        type:String,
    },
    projectPhoto:{
        type:String
    },
    status: {
    type: String,
    enum: ["planned", "in-progress", "on-hold", "completed", "cancelled"],
    default: "planned"
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: [{ type: String }],
    status:{
        type:String
    }
},{timestamps:true});

export default mongoose.models.Project || mongoose.model("Project",projectSchema);


  
  
  
