import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    isVerified: { type: Boolean, default: false }, // OTP verification flag
    otp: { type: String }, // temporary field
    otpExpiry: { type: Date }, // OTP expiry time
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
