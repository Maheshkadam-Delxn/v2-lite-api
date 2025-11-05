import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { PurchaseOrder } from "@/models/payment";
import "@/models/vendor";
import "@/models/project";
import { Indent } from "@/models/payment";

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { vendor, comments, projectId, addItems } = body;

    // ✅ Find last Purchase Order to generate next ID
    const lastPO = await PurchaseOrder.findOne().sort({ createdAt: -1 }).lean();

    let nextNumber = 1;
    if (lastPO && lastPO.purchaseId) {
      // Extract numeric part (e.g., PO-005 → 5)
      const lastNumber = parseInt(lastPO.purchaseId.replace(/\D/g, ""), 10);
      nextNumber = lastNumber + 1;
    }

    // ✅ Generate new ID with dash (PO-001, PO-002, ...)
    const nextPurchaseId = `PO-${nextNumber.toString().padStart(3, "0")}`;

    // ✅ Create new Purchase Order
    const po = await PurchaseOrder.create({
      purchaseId: nextPurchaseId,
      vendor,
      comments,
      projectId,
      addItems,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Purchase Order created successfully",
        data: po,
      },
      { status: 201 }
    );
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
