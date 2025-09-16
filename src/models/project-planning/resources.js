import mongoose from "mongoose";

const materialItemSchema = new mongoose.Schema({
  materialType: { type: String, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true } // could also be computed
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  labour: [
    {
      designation: { type: String, required: true },
      hourCost: { type: Number, required: true },
      dailyCost: { type: Number, required: true },
      monthlyCost: { type: Number, required: true }
    }
  ],

  materialFormulation: [
    {
      title: { type: String, required: true },
      unit: { type: String },
      area: { type: String },
      materials: [materialItemSchema]
    }
  ],

  nonLabour: [
    {
      title: { type: String, required: true },
      resourceId: { type: String, unique: true },
      hourCost: { type: Number },
      dailyCost: { type: Number },
      monthlyCost: { type: Number }
    }
  ],
  projectId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Project"
  }
}, { timestamps: true });

export default mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
