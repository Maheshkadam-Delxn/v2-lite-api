import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    project_code:{
        type:String,
        required:true,
        unique:true
    },
    project_name:{
        type:String,
        required:true
    },
    project_description:{
        type:String,
    },
    client_name:{
         type:String,
    },
    client_email:{
         type:String,
    },
    password: {
    type: String,
    required: true,
    },
    client_phone_number:{
         type:String,
    },
    location:{
        type:String,
    },
    startDate: { type: Date},
    endDate: { type: Date },
    budget:{
        type:Number,
        required:true,
        min:0
    },
   upload_files: [
      {
        fileName: { type: String },
        fileUrl: { type: String }, 
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],




    type:{
        type:String,
        enum:["Residential","Commercial","Industrial","Infrastructure"],
    },
    
    currency:{
        type:String,
        default:"INR"
    },
    zoneOffset:{
        type:String,
        default:"+00:00"
    },
    
    status: {
    type: String,
    enum: ["planned", "in-progress", "on-hold", "completed", "cancelled"],
    default: "planned"
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  tags: [{ type: String }],
  
},{timestamps:true});

export default mongoose.models.Project || mongoose.model("Project",projectSchema);


  
  
  
