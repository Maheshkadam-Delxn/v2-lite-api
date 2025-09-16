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

    // 📤 Fetch sent mails for this user
    const sentMails = await Mail.find({
      sender: userId,
      folder: "sent",
    })
      .sort({ createdAt: -1 }) // newest first
      .populate("recipients", "name email") // show recipient details
      .lean();

    return NextResponse.json({
      success: true,
      count: sentMails.length,
      mails: sentMails,
    });
  } catch (error) {
    console.error("GET /api/mail/sent error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sent mails", details: error.message },
      { status: 500 }
    );
  }
}
