import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import sendEmail from "@/utils/sendEmail";

export async function POST(request) {
  await connectDB();

  try {
    const { email } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create reset token (15 min validity)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    //  Development mode → return reset link directly
    if (
      process.env.NODE_ENV === "development" ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.log("Dev Reset Link:", resetLink);
      return NextResponse.json({
        message: "Password reset link (dev mode)",
        resetLink,
      });
    }

    //  Production mode → uncomment this block when SMTP is ready
    /*
    await sendEmail(
      user.email,
      "Password Reset Request",
      `
        Hello ${user.name},

        You requested to reset your password.

        Please click the link below to reset it (valid for 15 minutes):
        ${resetLink}

        If you did not request this, you can ignore this email.

        Thanks,
        SkyStruct Team
      `
    );
    
    return NextResponse.json({
      message: "Password reset link sent to email",
    });
    */

    //  Safety fallback (if somehow email config is missing in prod)
    return NextResponse.json({
      message: "Email service not configured",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
