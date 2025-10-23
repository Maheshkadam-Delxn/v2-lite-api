import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Expense } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  const decoded = await verifyToken(req);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    // ✅ Basic manual validation (optional, not strict like Zod)
    if (!body.title || !body.date || !body.category || !body.projectId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Create and save expense
    const expense = new Expense({
      title: body.title,
      date: body.date,
      voucherNo: body.voucherNo,
      amount: body.amount,
      vendor: body.vendor,
      category: body.category,
      description: body.description,
      file: body.file,
      projectId: body.projectId,
    });

    await expense.save();

    return NextResponse.json(
      { success: true, data: expense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Expense creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create expense", error: error.message },
      { status: 500 }
    );
  }
}
