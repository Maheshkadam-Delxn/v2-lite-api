// src/app/api/payment/indent/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Indent } from "../../../../models/payment"; 
import "@/models/member";
import "@/models/project";

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();

    // ✅ Find last indent to generate next indentId
    const lastIndent = await Indent.findOne().sort({ createdAt: -1 }).lean();

    let nextNumber = 1;
    if (lastIndent && lastIndent.indentId) {
      const lastNumber = parseInt(lastIndent.indentId.replace(/\D/g, ""), 10);
      nextNumber = lastNumber + 1;
    }

    // ✅ Generate new indent ID
    const nextIndentId = `IND${nextNumber.toString().padStart(3, "0")}`;

    // ✅ Merge with body
    const indentData = { ...body, indentId: nextIndentId };

    const indent = await Indent.create(indentData);

    return NextResponse.json({
      success: true,
      message: "Indent created successfully",
      data: indent,
    });
  } catch (error) {
    console.error("POST /api/indent error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}



export async function GET() {
  try {
    await connectDB();

    // Fetch all indents with related Member + Project populated
    const indents = await Indent.find()
      .populate("assignTo", "name email") // populate only some fields
      .populate("shareTo", "name email")
      .populate("projectId", "name projectCode");

    return NextResponse.json({
      success: true,
      data: indents,
    });
  } catch (error) {
    console.error("GET /api/payment/indent error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
