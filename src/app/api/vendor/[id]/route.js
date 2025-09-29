import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Vendor from "@/models/vendor";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(request, { params }) {
  await connectDB();

  const decoded = await verifyToken(request);
   
  /*
  if (!decoded || decoded.role !== "superadmin") {
    return NextResponse.json(
      { success: false, error: "Forbidden - Superadmin only" },
      { status: 403 }
    ); 
  }
  */

  try {
    const body = await request.json();
    const { status } = body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: vendor });
  } catch (err) {
    console.error("Vendor PATCH error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
