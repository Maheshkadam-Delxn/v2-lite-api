import mongoose from "mongoose";

// 🧩 Define user permission schema to match Role schema
const userPermissionSchema = new mongoose.Schema({
  module: { type: String, required: true },
  access: {
    add: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    menuVisible: { type: Boolean, default: false },
  },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    forgotPasswordOTP: { type: String },
    forgotPasswordExpiry: { type: Date },

    // 🧠 Role reference for permissions
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },

    // 🎯 User-specific permission overrides
    userPermissions: [userPermissionSchema],
  },
  { timestamps: true }
);

// Clear old model if hot-reloaded (important for Next.js)
delete mongoose.models.User;

export default mongoose.models.User || mongoose.model("User", userSchema);
