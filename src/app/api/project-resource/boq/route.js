import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import BOQ from "@/models/project-resources/boq";
import { verifyToken } from "@/lib/jwt";
import "@/models/member";
import "@/models/project";

//http://localhost:3000/api/project-resource/boq?projectId=68da5bc7f5974fa2939a5825
export async function GET(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const query = projectId ? { projectId } : {};
    const boqs = await BOQ.find(query).populate("sharedTo","name").populate("projectId","name");

    return NextResponse.json({ success: true, data: boqs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
