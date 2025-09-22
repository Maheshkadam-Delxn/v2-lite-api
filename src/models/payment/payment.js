import mongoose, { model } from "mongoose";

const indentSchema = new mongoose.Schema({
  indentId:{
    type:String,
    unique: true,
    required:true 
  },
  assignTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Member"
  },
  shareTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",  
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "In Progress", "Completed"], 
    default: "Pending",
  },
  projectId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Project"
      }  
});

const purchaseOrderSchema = new mongoose.Schema({
  purchaseId:{
    type:String,
    required:true 
  },
  vendor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor"
  },
  comments:{
    type:String
  },
  projectId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Project"
      },
  addItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Indent",
    },
  ],
});

const GRNSchema = new mongoose.Schema({
  grnID:{
    type:String,
    required:true 
  },
  challanNo:{
    type:String,
    required:true 
  },
  date:{
    type:String,
    required:true
  },
  attachment:[{
    name:{type:String},
    path:{type:String}
  }],
  projectId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Project"
  }
});



const expenseSchema = new mongoose.Schema({
  title:{
    type:String
  },
  date:{
    type:String
  },
  voucherNo:{
    type:String,
  },
  amount:{
    type:Number
  },
  vendor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor"
  },
  category:{
    type:String 
  },
  description:{
    type:String
  },
  file:[{
    name:{type:String},
    path:{type:String}
  }],
  projectId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Project"
      }
});

const Indent =  mongoose.models.Indent || mongoose.model('Indent',indentSchema);
const GRN =  mongoose.models.GRN || mongoose.model('GRN',GRNSchema);
const PurchaseOrder =  mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder',purchaseOrderSchema);
const Expense = mongoose.models.Expense || mongoose.model('Expense',expenseSchema);



export default { Indent, GRN, PurchaseOrder, Expense };

