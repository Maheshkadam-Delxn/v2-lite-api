import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Mail from "@/models/mail";
import jwt from "jsonwebtoken";

export async function GET(req) {
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

    // 🔎 Get query string
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim() === "") {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // ✅ Search in subject, body, or folder (case-insensitive)
    const mails = await Mail.find({
      $and: [
        { $or: [{ sender: userId }, { recipients: userId }] }, // user accessible
        {
          $or: [
            { subject: { $regex: q, $options: "i" } },
            { body: { $regex: q, $options: "i" } },
            { folder: { $regex: q, $options: "i" } }
          ]
        }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: mails.length,
      mails
    });
  } catch (error) {
    console.error("GET /api/mail/search error:", error);
    return NextResponse.json(
      { error: "Failed to search mails", details: error.message },
      { status: 500 }
    );
  }
}
