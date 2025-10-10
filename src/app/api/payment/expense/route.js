import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Expense } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";



// ✅ Get all Expenses
export async function GET() {

  const decoded = await verifyToken(req);
  if(!decoded){
    return NextResponse.json(
      {success:false,error:"Unauthorized"},
      {status:401}
    );
  }

  
  try {

    await connectDB();

    const {searchParams} = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const query = projectId ? {projectId} : {};

    const expenses = await Expense.find(query)
      .populate("vendor","name")
      .populate("projectId","name")
      .sort({date:-1});

    return NextResponse.json({ success: true, data: expenses, count:expenses.length },{status:200});
  } catch (error) {
    console.error("GET /api/payment/expense error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
