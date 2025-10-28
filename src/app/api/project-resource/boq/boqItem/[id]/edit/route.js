import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import BOQ from "@/models/project-resources/boq";
import BOQItem from "@/models/project-resources/boqItem";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(req, { params }) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const updates = await req.json();

    const item = await BOQItem.findById(id);
    if (!item)
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });

    const boq = await BOQ.findById(item.boqName);
    if (!boq)
      return NextResponse.json({ success: false, error: "BOQ not found" }, { status: 404 });

    // 🔒 Restrict editing for fixed BOQs
    if (boq.type === "fixed") {
      return NextResponse.json({
        success: false,
        error: "Cannot edit items in a fixed BOQ",
      }, { status: 403 });
    }

    Object.assign(item, updates);
    if (item.quantity && item.contractorLabourRate) item.total = item.quantity * item.unitCost + item.contractorLabourRate;
    await item.save();

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
