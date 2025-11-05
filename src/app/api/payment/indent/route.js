// src/app/api/payment/indent/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Indent } from "../../../../models/payment"; 
<<<<<<< HEAD
import "@/models/member";
import "@/models/project";

export async function POST(request) {
=======


export async function POST(req) {
>>>>>>> 020cad8a92dffc40b0d67e4723aa9e769b95c77d
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

<<<<<<< HEAD


export async function GET() {
=======
export async function GET(req) {
  await connectDB();
>>>>>>> 020cad8a92dffc40b0d67e4723aa9e769b95c77d
  try {
    const url = new URL(req.url);
    const { status, projectId } = Object.fromEntries(url.searchParams);

    const query = {};
    if (status) query.status = status;
    if (projectId) query.projectId = projectId;

    const indents = await Indent.find(query).populate("assignTo projectId");
    return NextResponse.json({ success: true, data: indents });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
