import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import BOQ from "@/models/project-resources/boq";
import BOQItem from "@/models/project-resources/boqItem";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try { 
    const decoded = await verifyToken(req);
    if (!decoded)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    console.log("Body",body);
    const { boqName, itemNo, quantity, unitCost, unit, contractorLabourRate, description,remark } = body;

     if (!boqName || !itemName)
     return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });

    const boq = await BOQ.findById(boqName);
    if (!boq)
      return NextResponse.json({ success: false, error: "BOQ not found" }, { status: 404 });

    // ✅ Allowed for both fixed and variable BOQs
    const total = contractorLabourRate && quantity ? (unitCost * quantity + contractorLabourRate): 0;

    const item = await BOQItem.create({
      boqName,
      itemNo,
      quantity,
      unit,
      contractorLabourRate,
      total,
      description,
      remark,
      unitCost
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
