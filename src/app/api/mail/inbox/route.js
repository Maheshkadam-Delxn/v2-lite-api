import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Mail from "@/models/mail";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // 🔐 Get auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized - Missing Token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized - Invalid Token" }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: "Invalid user in token" }, { status: 401 });
    }

    // 📩 Fetch inbox mails for this user
    const inboxMails = await Mail.find({
      recipients: userId,
      folder: "inbox",
    })
      .sort({ createdAt: -1 }) // newest first
      .populate("sender", "name email") // show sender details
      .lean();

    return NextResponse.json({
      success: true,
      count: inboxMails.length,
      mails: inboxMails,
    });
  } catch (error) {
    console.error("GET /api/mail/inbox error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inbox", details: error.message },
      { status: 500 }
    );
  }
}
