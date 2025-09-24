import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true},
  email: { type: String, required: true, unique: true, lowercase: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link with auth user
  vendorCode: { type: String, required: true, unique: true },
  taxNo: { type: String, required: true },
  gstinNo: { type: String, required: true},
  vendorType: { type: String, required: true },
  address: { type: String, required: true},


  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending"
  },

  documents: [
    {
      fileName: String,
      filePath: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
