import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Mail from "@/models/mail";
import User from "@/models/user";
import jwt from "jsonwebtoken";

export async function POST(req) {
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

    const { subject, message, recipients, attachments = [] } = await req.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ error: "At least one recipient is required" }, { status: 400 });
    }

    // ✅ Validate recipients exist
    const recipientUsers = await User.find({ _id: { $in: recipients } });
    if (recipientUsers.length !== recipients.length) {
      return NextResponse.json({ error: "One or more recipients not found" }, { status: 400 });
    }

    const senderId = decoded.userId; // ✅ consistent sender id
    if (!senderId) {
      return NextResponse.json({ error: "Invalid sender in token" }, { status: 401 });
    }

    // 1️⃣ Save mail in sender's "sent"
    const sentMail = await Mail.create({
      sender: senderId,
      recipients,
      subject,
      message,
      attachments,
      folder: "sent",
      read: true, // sender has seen it
    });

    // 2️⃣ Save mail in each recipient's "inbox"
    const inboxMails = await Promise.all(
      recipients.map((recipientId) =>
        Mail.create({
          sender: senderId,
          recipients: [recipientId],
          subject,
          message,
          attachments,
          folder: "inbox",
          read: false,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Mail sent successfully",
      sent: sentMail,
      inbox: inboxMails,
    });
  } catch (error) {
    console.error("Error sending mail:", error);
    return NextResponse.json(
      { error: "Failed to send mail", details: error.message },
      { status: 500 }
    );
  }
}
