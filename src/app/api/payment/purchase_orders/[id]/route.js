import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { PurchaseOrder } from "@/models/payment";

// ✅ Get single PO
export async function GET(req, { params }) {
  await connectDB();
  try {
    const po = await PurchaseOrder.findById(params.id)
      .populate("vendor")
      .populate("addItems")
      .populate("projectId");

    if (!po) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: po });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ Update PO
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const body = await req.json();
    const updated = await PurchaseOrder.findByIdAndUpdate(params.id, body, { new: true })
      .populate("vendor")
      .populate("addItems")
      .populate("projectId");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ Delete PO
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await PurchaseOrder.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
