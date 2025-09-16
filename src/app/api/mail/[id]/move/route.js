import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Mail from "@/models/mail";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // 🔐 Get auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Missing Token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid Token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid user in token" },
        { status: 401 }
      );
    }

    // 📩 Get body { folder: "spam" | "trash" | "customLabel" }
    const { folder } = await req.json();
    if (!folder || typeof folder !== "string") {
      return NextResponse.json(
        { error: "Invalid request - folder is required" },
        { status: 400 }
      );
    }

    // ✅ Allowed system folders (or treat as custom label)
    const systemFolders = ["inbox", "sent", "draft", "spam", "trash"];
    const targetFolder = systemFolders.includes(folder.toLowerCase())
      ? folder.toLowerCase()
      : folder; // if not system → custom label

    // ✅ Update mail (only if accessible to user)
    const updatedMail = await Mail.findOneAndUpdate(
      { _id: id, $or: [{ sender: userId }, { recipients: userId }] },
      { $set: { folder: targetFolder } },
      { new: true }
    );

    if (!updatedMail) {
      return NextResponse.json(
        { error: "Mail not found or not accessible" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mail moved to ${targetFolder}`,
      mail: updatedMail,
    });
  } catch (error) {
    console.error("PATCH /api/mail/:id/move error:", error);
    return NextResponse.json(
      { error: "Failed to move mail", details: error.message },
      { status: 500 }
    );
  }
}
