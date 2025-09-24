import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { PurchaseOrder } from "@/models/payment";

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { addItems } = await req.json(); 
    // expecting: { addItems: ["indentId1", "indentId2"] }

    if (!Array.isArray(addItems) || addItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "addItems must be a non-empty array" },
        { status: 400 }
      );
    }

    const updated = await PurchaseOrder.findByIdAndUpdate(
      params.id,
      { $addToSet: { addItems: { $each: addItems } } }, // prevents duplicates
      { new: true }
    )
      .populate("vendor")
      .populate("addItems")
      .populate("projectId");

    if (!updated) {
      return NextResponse.json({ success: false, error: "Purchase Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error adding items:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
