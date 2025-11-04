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
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password: { type: String, required: true },
    phone:{
        type:String
    },
    department:{
        type:String,
        required:true 
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required:true 
    },
    prefferedLanguage:{
        type:String,
        enum:["Arabic","English"]
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
  status:{
    type: String,
    enum:["Active" , "Inactive"],
    default:"Active"
} 
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model("Member", memberSchema);