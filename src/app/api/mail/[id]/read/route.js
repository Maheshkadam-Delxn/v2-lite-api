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

    // 📩 Get body { read: true/false }
    const { read } = await req.json();
    if (typeof read !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request - read must be true/false" },
        { status: 400 }
      );
    }

    // ✅ Update only if mail belongs to this user (inbox)
    const updatedMail = await Mail.findOneAndUpdate(
      { _id: id, recipients: userId, folder: "inbox" },
      { $set: { read } },
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
      message: `Mail marked as ${read ? "read" : "unread"}`,
      mail: updatedMail,
    });
  } catch (error) {
    console.error("PATCH /api/mail/:id/read error:", error);
    return NextResponse.json(
      { error: "Failed to update mail", details: error.message },
      { status: 500 }
    );
  }
}
