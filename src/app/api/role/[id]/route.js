import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Role from "@/models/role";
import { verifyToken } from "@/lib/jwt";

// PATCH: Update role permissions with service-based structure
export async function PATCH(req, { params }) {
  // const decoded = await verifyToken(req);
  // if (!decoded) {
  //   return NextResponse.json(
  //     { success: false, error: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  await connectDB();

  try {
    const { id } = params;
    const { Permissions } = await req.json();

    if (!Permissions || typeof Permissions !== "object") {
      return NextResponse.json(
        { success: false, error: "Permissions object is required" },
        { status: 400 }
      );
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { Permissions },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Service-based permissions updated", role: updatedRole },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Role API error (PATCH):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req, { params }) {


  // const decoded = await verifyToken(req);
  // if (!decoded) {
  //   return NextResponse.json(
  //     { success: false, error: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  await connectDB();

  try {
    const { id } = params;

    // Fetch role by ID and populate permissions if your schema supports it
    const role = await Role.findById(id);
      //.populate("permissions.module") // if you store module references
      //.populate("parentRole") // optional: if you have parent role relationship
      //.lean();

      console.log("Role",role);

    if (!role) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: role },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Role GET by ID error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



