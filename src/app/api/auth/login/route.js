// src/app/api/auth/login/route.js
/*
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

export async function POST(req) {
  await connectDB();
  console.log(" DB connection confirmed inside login API");

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    //  Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const roleName = user.role?.name || "";

    //  Sign JWT
    const token = jwt.sign(
      { id: user._id, role: roleName, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token valid for 1 day
    );

    // Hide password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Login API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

*/

// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import { serialize } from "cookie";

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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const roleName = user.role?.name || "";

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, role: roleName, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Hide password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Create httpOnly cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: true,
      //secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userResponse, // no token here!
      },
      { status: 200 }
    );

    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

