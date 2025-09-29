import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Indent } from "@/models/payment";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const indent = await Indent.findById(params.id)
    //.populate("assignTo projectId");
    if (!indent) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: indent });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const body = await req.json();
    const updated = await Indent.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await Indent.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
