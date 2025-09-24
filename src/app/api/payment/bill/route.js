import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { BillPayment } from "@/models/payment";

// ✅ Create Bill Payment
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const bill = await BillPayment.create(body);

    return NextResponse.json({
      success: true,
      message: "Bill Payment recorded successfully",
      data: bill,
    });
  } catch (error) {
    console.error("POST /api/payment/bill error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get all Bill Payments
export async function GET() {
  await connectDB();
  try {
    const bills = await BillPayment.find()
      .populate("vendor")
      .populate("projectId");

    return NextResponse.json({ success: true, data: bills });
  } catch (error) {
    console.error("GET /api/payment/bill error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
