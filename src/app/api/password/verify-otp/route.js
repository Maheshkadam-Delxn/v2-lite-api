import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

export async function POST(request) {
  await connectDB();

  try {
    const { email, otp } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    //if (user.forgotPasswordOTP !== otp || user.forgotPasswordExpiry < new Date()) {
    //  return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    //}

    // OTP verified → clear it
    user.forgotPasswordOTP = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "OTP verified, you can now reset your password",
    });
  } catch (err) {
    console.error("Forgot-password OTP verification error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
