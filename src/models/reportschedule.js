import mongoose from "mongoose";

const reportScheduleSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  reportName: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  sendTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
  ],
  reportType: {
    type: String,
    enum: ["PDF", "XLSX"],
    required: true,
  },
  durationType: {
    type: String,
    enum: ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"], // flexible for future
    required: true,
  },
  selectTime: {
    type: String, // HH:mm format (e.g. "12:35 PM")
    required: true,
  },
  attributes: [
    {
      type: String, // e.g. "Date", "Item Name", "Item Number"
    },
  ],
  reportParameters: [
    {
      type: String, // e.g. "Quantity", "Total Cost", "Phase Name"
    },
  ],
  message: {
    type: String, // template message e.g. "This BOQ Schedule for {{Item Name}}"
  },
  status: {
    type: Boolean,
    default: true, // active/inactive
  },
}, { timestamps: true });

export default mongoose.models.ReportSchedule ||
  mongoose.model("ReportSchedule", reportScheduleSchema);
