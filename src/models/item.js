import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    unit: {
      type: String,
      default: "pcs", // can be pcs, kg, litre, etc.
    },
    rate: {
      type: Number,
      required: true,
    },
    stockQty: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
