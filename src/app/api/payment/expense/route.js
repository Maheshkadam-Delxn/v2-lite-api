import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Expense } from "@/models/payment";
import Vendor from  "@/models/vendor";

// ✅ Create Expense
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const expense = await Expense.create(body);

    return NextResponse.json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    console.error("POST /api/payment/expense error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Get all Expenses
export async function GET() {
  await connectDB();
  try {
    const expenses = await Expense.find()
      .populate("vendor")
      .populate("projectId");

    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error("GET /api/payment/expense error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
