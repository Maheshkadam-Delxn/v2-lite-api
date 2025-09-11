import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/project";

// ✅ 6.1 Create new project
export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const project = await Project.create(body);

    return NextResponse.json({ success: true, project });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ 6.2 Project listing (with filters)
export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const format = searchParams.get("format"); // grid or list (frontend choice)

    let query = {};
    if (status) query.status = status;

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, projects, format });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
