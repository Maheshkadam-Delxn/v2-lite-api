
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  module: { type: String, required: true },   //reference model
  access: {
    add: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    view: { type: Boolean, default: false },
    menuVisible: { type: Boolean, default: false },
  },
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
      "admin",
      "vendor",
      "contractor",
      "site_manager",
      "manager",
      "approver",
      "consultant",
      "project_admin",
    ],
    required: true,
  },
  permissions: [permissionSchema],
});

// ✅ Correct hot-reload safe export
export default mongoose.models.Role || mongoose.model("Role", roleSchema);
