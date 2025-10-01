// app/api/auth/reset-password/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

export async function POST(req) {
  await connectDB();
  console.log("Connected to DB ✅");

  try {
    const { email, newPassword } = await req.json();
    console.log("Request body:", { email, newPassword });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Check if OTP was verified (OTP field cleared after verification)
    if (user.forgotPasswordOTP) {
      console.log("OTP not verified for user:", email);
      return NextResponse.json({ success: false, message: "OTP not verified" }, { status: 400 });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Clear expiry just in case
    user.forgotPasswordExpiry = undefined;

    await user.save();
    console.log("Password reset successfully for user:", email);

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
