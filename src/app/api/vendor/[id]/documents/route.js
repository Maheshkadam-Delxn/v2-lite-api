import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Vendor from "@/models/vendor";
import { verifyToken } from "@/lib/jwt";
import fs from "fs";
import path from "path";

// ✅ Vendor uploads their own document
export async function POST(request, { params }) {
  console.log("===== Vendor Document Upload API Called =====");

  await connectDB();
  console.log("✅ Database connected");

  try {
    const decoded = await verifyToken(request);
    console.log("🔐 Decoded JWT:", decoded);

    const { id } = params;
    console.log("📌 Vendor ID from URL params:", id);

    const formData = await request.formData();
    const file = formData.get("file");
    console.log("📂 Received file from formData:", file?.name || "No file");

    if (!file) {
      console.warn("⚠️ No file uploaded");
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      console.warn("⚠️ Invalid file type:", file.type);
      return NextResponse.json(
        { success: false, error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Save file to /public/uploads/vendor
    const uploadDir = path.join(process.cwd(), "public", "uploads", "vendor");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("📁 Created upload directory:", uploadDir);
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    console.log("💾 File saved to:", filePath);

    // Update vendor document array
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      console.warn("⚠️ Vendor not found:", id);
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    vendor.documents.push({
      fileName: file.name,
      filePath: `/uploads/vendor/${fileName}`,
    });

    await vendor.save();
    console.log("✅ Vendor document array updated:", vendor.documents.length);

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      vendorId: vendor._id,
      filePath: `/uploads/vendor/${fileName}`,
    });
  } catch (error) {
    console.error("❌ Vendor document upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
