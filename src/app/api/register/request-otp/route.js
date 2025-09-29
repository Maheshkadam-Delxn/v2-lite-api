import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

// Utility: send email
async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
  });
}

export async function POST(request) {
  await connectDB();

  try {
    const { name, email, mobile, password } = await request.json();

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User already registered" },
        { status: 400 }
      );
    }

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (user) {
      user.otp = generatedOTP;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email,
        mobile,
        password: hashedPassword,
        otp: generatedOTP,
        otpExpiry,
        isVerified: false,
      });
    }

    await sendOTP(email, generatedOTP);

    return NextResponse.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("Request OTP Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
