// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken"; // Add this
 
export async function POST(request) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
 
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token format" },
        { status: 401 }
      );
    }
 
    // Verify JWT (use your JWT_SECRET env var—ensure it's set on Vercel)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Logout: Valid token for user", decoded.sub || decoded.userId); // Debug log
    } catch (jwtError) {
      console.error("Logout JWT Error:", jwtError.message);
      return NextResponse.json(
        { success: false, message: `Unauthorized: ${jwtError.message}` },
        { status: 401 }
      );
    }
 
    // If valid, logout (delete cookie)
    const res = NextResponse.json({ success: true, message: "Logged out successfully" });
    res.headers.set(
      "Set-Cookie",
      serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // Expire immediately
      })
    );
 
    return res;
  } catch (error) {
    console.error("Logout Handler Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
