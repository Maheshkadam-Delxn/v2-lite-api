// app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import sendEmail from "@/utils/sendEmail";

export async function POST(req) {
  await connectDB();
  try {
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 min expiry

    // Save OTP + expiry in user document
    user.resetPasswordOTP = otp;
    user.resetPasswordExpiry = expiry;
    await user.save();

    // Send OTP email
    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP for resetting password is: ${otp} (valid for 10 minutes)`
    );

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot-password error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
