import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["planned", "in-progress", "on-hold", "completed", "cancelled"],
    default: "planned"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  budget: { type: Number },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
