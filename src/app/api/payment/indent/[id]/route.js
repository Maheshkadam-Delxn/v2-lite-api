import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import {Indent} from "@/models/payment";

// Ensure these models are registered
import "@/models/member";
import "@/models/project";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const indent = await Indent.findById(params.id)
<<<<<<< HEAD
    //.populate("assignTo projectId");
    if (!indent) return NextResponse.json({ error: "Not found" }, { status: 404 });
=======
      .populate("assignTo", "name email")
      .populate("shareTo", "name email")
      .populate("projectId", "name projectCode");

    if (!indent) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

>>>>>>> 222c6fa7b1f7ad0f05516ae59798a8aedee45929
    return NextResponse.json({ success: true, data: indent });
  } catch (err) {
    console.error("GET /api/payment/indent/[id] error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
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
