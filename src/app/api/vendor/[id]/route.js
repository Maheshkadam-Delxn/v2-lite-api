// app/api/vendor/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Vendor from "@/models/vendor";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(request, { params }) {
  await connectDB();

  const decoded = await verifyToken(request);
   
  
  if (!decoded || decoded.role !== "superadmin") {
    return NextResponse.json(
      { success: false, error: "Forbidden - Superadmin only" },
      { status: 403 }
    );
  }
  

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




// PUT: Update vendor details by ID
export async function PUT(req, { params }) {
  await connectDB();
  console.log(" DB connected in Vendor PUT API");

  try {
    const { id } = params;
    const body = await req.json();
    console.log(" Incoming update request:", { id, body });

    // Prevent updating immutable fields
    const immutableFields = ["_id", "vendorCode", "createdAt", "updatedAt"];
    immutableFields.forEach((field) => delete body[field]);

    // Find and update vendor
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      console.warn(" Vendor not found:", id);
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    console.log(" Vendor updated:", updatedVendor._id);

    return NextResponse.json({
      success: true,
      message: "Vendor updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(" Vendor PUT API error:", error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

