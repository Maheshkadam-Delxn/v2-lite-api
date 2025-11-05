// /app/api/vendor

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Vendor from "@/models/vendor";
import { verifyToken } from "@/lib/jwt";


/*
export async function POST(request) {
  await connectDB();

  //  Pass the Next.js Request object
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
*/

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
// */

// export async function GET(req) {
//   await connectDB();

//   try {
//     // 1️⃣ Verify JWT from Authorization header
//     const decoded = verifyToken(req);
//     if (!decoded) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // 2️⃣ Find user in DB and populate role + permissions
//     const user = await User.findById(decoded.id).populate("role");
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // 3️⃣ Check if user has view access for vendor module
//     const canView = checkPermission(user, "vendor", "view");
//     if (!canView) {
//       return NextResponse.json(
//         { success: false, error: "You do not have access to view this resource" },
//         { status: 403 }
//       );
//     }

//     // 4️⃣ If access allowed, return dummy vendor data (replace with real DB query)
//     const vendors = await Vendor.find(); // You can add .select(...) to limit fields

//     return NextResponse.json({
//       success: true,
//       data: vendors,
//     });

    

//   } catch (error) {
//     console.error("💥 Vendor API error:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


export async function POST(request) {
  console.log("Vendor POST API called");
  await connectDB();

  try {
    const body = await request.json();
    console.log("Request body:", body);

    // 🔐 Validate password
    if (!body.password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // ⚠️ Check for duplicate email in either Vendor or User collection
    const existingVendor = await Vendor.findOne({ email: body.email });
    const existingUser = await User.findOne({ email: body.email });

    if (existingVendor || existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already registered. Please use a different email or login instead.",
        },
        { status: 400 }
      );
    }

    // 🔹 Generate unique vendorCode
    const lastVendor = await Vendor.findOne().sort({ createdAt: -1 });
    let newVendorCode = "VEND-001";
    if (lastVendor?.vendorCode) {
      const lastNumber = parseInt(lastVendor.vendorCode.split("-")[1]) || 0;
      newVendorCode = `VEND-${String(lastNumber + 1).padStart(3, "0")}`;
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // ✅ Create Vendor
    const vendorData = {
      ...body,
      password: hashedPassword,
      vendorCode: newVendorCode,
    };
    const vendor = await Vendor.create(vendorData);

    // ✅ Create corresponding User
    const userData = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: "vendor",
      vendorId: vendor._id,
      status: vendor.status || "pending",
    };
    const user = await User.create(userData);

    return NextResponse.json({
      success: true,
      message: "Vendor registered successfully",
      vendor,
      user,
    });
  } catch (err) {
    console.error("Vendor POST error:", err);

    // Handle duplicate key error safely
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate value for field "${field}": "${err.keyValue[field]}"`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}