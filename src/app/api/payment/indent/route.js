// src/app/api/payment/indent/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Indent } from "../../../../models/payment"; 
import "@/models/member";
import "@/models/project";



export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const indent = await Indent.create(body);
    return NextResponse.json({ success: true, data: indent }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
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
