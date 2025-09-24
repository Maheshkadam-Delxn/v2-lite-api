import { NextResponse } from "next/server";
<<<<<<< HEAD
import connectDB from "@/lib/mongoose";
import { Indent } from "@/models/payment/payment";
=======
import connectDB from "../../../../../lib/mongoose";
import { Indent } from "../../../../../models/payment";
>>>>>>> da5a89cb8e5c4442ff24e10b4995b107c16f222b

export async function GET(req, { params }) {
  await connectDB();
  try {
    const indent = await Indent.findById(params.id).populate("assignTo projectId");
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
