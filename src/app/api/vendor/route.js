// /app/api/vendor

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Vendor from "@/models/vendor";
import { verifyToken } from "@/lib/jwt";

export async function POST(request) {
  await connectDB();

  //  Pass the Next.js Request object
  const decoded = verifyToken(request);
  console.log(decoded);

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

export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);

    //  Sorting
    const sortField = searchParams.get("sort") || "createdAt";
    const sortOrder = searchParams.get("order") === "asc" ? 1 : -1;

    //  Filtering
    const filter = {};
    ["vendorCode", "taxNo", "gstinNo", "vendorType", "address", "status"].forEach((field) => {
      const value = searchParams.get(field);
      if (value) filter[field] = value;
    });

    //  Searching
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { vendorCode: { $regex: search, $options: "i" } },
        { taxNo: { $regex: search, $options: "i" } },
        { gstinNo: { $regex: search, $options: "i" } },
        { vendorType: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } }
      ];
    }

    const vendors = await Vendor.find(filter).sort({ [sortField]: sortOrder });

    return NextResponse.json({ success: true, data: vendors });
  } catch (err) {
    console.error("Vendor GET error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



