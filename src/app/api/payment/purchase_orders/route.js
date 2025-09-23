import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { PurchaseOrder } from "@/models/payment";

// ✅ Create Purchase Order
export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const { purchaseId, vendor, comments, projectId, addItems } = body;

    const po = await PurchaseOrder.create({
      purchaseId,
      vendor,
      comments,
      projectId,
      addItems, // array of Indent IDs
    });

    return NextResponse.json({ success: true, data: po }, { status: 201 });
  } catch (error) {
    console.error("Error creating Purchase Order:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get All Purchase Orders
export async function GET() {
  await connectDB();
  try {
    const pos = await PurchaseOrder.find()
      .populate("vendor")
      .populate("addItems")
      .populate("projectId");

    return NextResponse.json({ success: true, data: pos });
  } catch (error) {
    console.error("Error fetching Purchase Orders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
