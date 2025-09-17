import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Indent } from "@/models/payment";

// Create indent
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const indent = await Indent.create(body);
    return NextResponse.json({ success: true, indent });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// List all indents
export async function GET() {
  await connectDB();
  try {
    const indents = await Indent.find().populate("assignTo projectId");
    return NextResponse.json({ success: true, indents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
