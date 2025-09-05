import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true},
    email: { type: String, required: true, unique: true, lowercase: true },
    phone_number: { type: String, required: true, unique: true, trim: true},
    password: { type: String, required: true, minlength: 6,},

    // main role
    role: {
      type: String,
      enum: ["superadmin", "vendor", "member"],
      default: "member",
    },

    // only required if role = member
    memberRole: {
      type: String,
      enum: ["project_admin", "consultant", "contractor", "approver", null],
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Ensure memberRole is only set if role = "member"
userSchema.pre("save", function (next) {
  if (this.role !== "member") {
    this.memberRole = null;
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
