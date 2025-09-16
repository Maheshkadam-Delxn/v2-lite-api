import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  subject: { type: String, required: true },
  body: { type: String },
  attachments: [{ url: String, name: String }],
  labels: [{ type: String }],
  folder: { 
    type: String, 
    enum: ["inbox", "sent", "draft", "spam", "trash"], 
    default: "inbox" 
  },
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Mail || mongoose.model("Mail", mailSchema);
