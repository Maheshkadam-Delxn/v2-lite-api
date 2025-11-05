import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { BillPayment } from "@/models/payment";

// ✅ Create Bill Payment
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // ✅ Find the last bill to generate the next Bill No.
    const lastBill = await BillPayment.findOne().sort({ createdAt: -1 }).lean();

    let nextNumber = 1;
    if (lastBill && lastBill.billNo) {
      // Extract numeric part (e.g. BILL-007 → 7)
      const lastNumber = parseInt(lastBill.billNo.replace(/\D/g, ""), 10);
      nextNumber = lastNumber + 1;
    }

    // ✅ Generate new Bill No. (e.g. BILL-001)
    const nextBillNo = `BILL-${nextNumber.toString().padStart(3, "0")}`;

    // ✅ Create new Bill Payment with auto-generated billNo
    const bill = await BillPayment.create({
      ...body,
      billNo: nextBillNo,
    });

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
