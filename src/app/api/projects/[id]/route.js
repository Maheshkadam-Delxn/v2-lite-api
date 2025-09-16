import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/project";

// ✅ 6.5 Get project details
export async function GET(req, { params }) {
  await connectDB();
  try {
    const project = await Project.findById(params.id).populate("members", "name email role");
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
