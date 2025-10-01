import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone_number: { type: String, required: true, unique: true, trim: true},
    password: { type: String, required: true, minlength: 6,},

    // main role
    role: {
      type: String,
      enum: ["superadmin","admin", "vendor", "member"],
      default: "member",
    },

    // only required if role = member
    memberRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Role",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
