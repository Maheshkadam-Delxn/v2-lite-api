// app/api/vendor/[id]/documents/route.js
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import connectDB from "@/lib/mongoose";
import Vendor from "@/models/vendor";
import { verifyToken } from "@/lib/jwt";

export async function POST(request, { params }) {
  await connectDB();

  try {
    // ✅ unwrap params in Next.js 15
    const { id } = await params;

    // ✅ Verify JWT
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Parse multipart form
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Save file locally
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    await writeFile(filePath, buffer);

    // ✅ Update vendor with document info
    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $push: { documents: { filename: file.name, path: filePath } } },
      { new: true }
    );

    return NextResponse.json({ success: true, data: vendor });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

