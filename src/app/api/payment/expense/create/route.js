import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Expense } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";
import { z } from "zod";

const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  voucherNo: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  vendor: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  file: z
    .array(
      z.object({
        name: z.string(),
        path: z.string(),
      })
    )
    .optional(),
  projectId: z.string().min(1, "Project ID is required"),
});

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

    // ✅ Validate body against schema
    const validatedData = expenseSchema.parse(body);

    const expense = new Expense(validatedData);
    await expense.save();

    return NextResponse.json(
      { success: true, data: expense },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    console.error("Expense creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create expense", error: error.message },
      { status: 500 }
    );
  }
}
