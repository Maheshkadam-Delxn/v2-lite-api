import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import BOQ from "@/models/boq";
import BOQItem from "@/models/boqItem";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { boqId, itemName, quantity, unit, rate } = body;

    if (!boqId || !itemName)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });

    const boq = await BOQ.findById(boqId);
    if (!boq)
      return NextResponse.json({ success: false, error: "BOQ not found" }, { status: 404 });

    // ✅ Allowed for both fixed and variable BOQs
    const total = rate && quantity ? rate * quantity : 0;

    const item = await BOQItem.create({
      boqId,
      itemName,
      quantity,
      unit,
      rate,
      total,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
