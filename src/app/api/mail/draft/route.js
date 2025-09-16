import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Mail from "@/models/mail";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    //  Get auth header
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

    //  Fetch drafts for this user
    const drafts = await Mail.find({
      sender: userId,
      folder: "draft",
    })
      .sort({ updatedAt: -1 }) // latest edited first
      .populate("recipients", "name email") // optional: show recipients
      .lean();

    return NextResponse.json({
      success: true,
      count: drafts.length,
      mails: drafts,
    });
  } catch (error) {
    console.error("GET /api/mail/draft error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts", details: error.message },
      { status: 500 }
    );
  }
}



export async function POST(req) {
  try {
    await connectDB();

    // 🔐 Auth header
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

    // 📩 Request body
    const { subject, body, recipients, attachments } = await req.json();

    // ✅ Save mail as draft
    const draftMail = await Mail.create({
      sender: userId,
      recipients: recipients || [], // can be empty
      subject: subject || "",
      body: body || "",
      attachments: attachments || [],
      folder: "draft"
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully",
      draft: draftMail
    });
  } catch (error) {
    console.error("POST /api/mail/draft error:", error);
    return NextResponse.json(
      { error: "Failed to save draft", details: error.message },
      { status: 500 }
    );
  }
}
