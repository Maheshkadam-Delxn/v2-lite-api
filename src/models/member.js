import mongoose from "mongoose";

const memberSchema =  new mongoose.Schema({
    staffNumber :{
        type: String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    phone:{
        type:String
    },
    department:{
        type:String,
        required:true 
    },
    preferredLanguage:{
        type:String,
        enum :["consultant", "approver", "contractor", "site manager", "manager"],
        required:true 
    },
    service :{
        type:String,
        required:true
    },
    code: { type: String },
  grade: { type: String },
  discipline: { type: String },
  profileImage: { type: String }, // URL or file path

  // For org chart
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model("Member", memberSchema);