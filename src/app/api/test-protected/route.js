// /app/api/test-protected/route.js
import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/middleware/auth";

async function handler(req) {
  return NextResponse.json({
    success: true,
    message: "You accessed a protected route!",
    user: req.user,
  });
}

// Only allow superadmin and admin
export const GET = authMiddleware(handler, ["superadmin", "admin"]);
