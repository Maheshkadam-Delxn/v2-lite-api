// /app/api/vendor

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Vendor from "@/models/vendor";
import { verifyToken } from "@/lib/jwt";

export async function POST(request) {
  await connectDB();

  // ✅ Pass the Next.js Request object
  const decoded = verifyToken(request);

  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const vendor = await Vendor.create({
      userId: decoded.id,   // take from token instead of trusting body
      ...body
    });

    return NextResponse.json({ success: true, data: vendor });
  } catch (err) {
    console.error("Vendor POST error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


