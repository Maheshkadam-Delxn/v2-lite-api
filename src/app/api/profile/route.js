import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import { verifyToken } from "@/lib/jwt"; // your JWT verification helper

export async function GET(request) {
  await connectDB();

  try {
    // ✅ Verify the JWT from HttpOnly cookie
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find the user using decoded ID or email
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // ✅ Send user profile
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

