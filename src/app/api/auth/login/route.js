
// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

export async function POST(req) {
  await connectDB();
  console.log("DB connection confirmed inside login API");

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const roleName = user.role?.name || "";

    const token = jwt.sign(
      { id: user._id, role: roleName, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    // Create response with token in body
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful for localhost",
        token, 
        user: userResponse,
      },
      { status: 200 }
    );

    // Set token in HttpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


 
