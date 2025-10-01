import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { GRN } from "@/models/payment";
import "@/models/project";

// ✅ Create GRN
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const grn = await GRN.create(body);

    return NextResponse.json({
      success: true,
      message: "GRN created successfully",
      data: grn,
    });
  } catch (error) {
    console.error("POST /api/payment/grn error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get all GRNs
export async function GET() {
  await connectDB();
  try {
    const grns = await GRN.find().populate("projectId");
    return NextResponse.json({ success: true, data: grns });
  } catch (error) {
    console.error("GET /api/payment/grn error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
