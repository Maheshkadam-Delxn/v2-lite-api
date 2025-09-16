// src/app/api/roles/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Role from "@/models/role";

// PATCH: Update role permissions
export async function PATCH(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const { permissions } = await req.json();

    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: "Permissions array is required" },
        { status: 400 }
      );
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { permissions },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Permissions updated", role: updatedRole },
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
