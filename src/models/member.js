import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    staffNumber: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, },
    phone: { type: String },
    department: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    prefferedLanguage: { type: String, enum: ["Arabic", "English"] },
    service: { type: String, required: true },
    code: { type: String },
    grade: { type: String },
    discipline: { type: String },
    Permissions:{type:Object},
    profileImage: { type: String },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    status: { type: String, enum: ["Active", "InActive"], default: "Active" }
}, { timestamps: true });
delete mongoose.models.Member;
export default mongoose.models.Member || mongoose.model("Member", memberSchema);