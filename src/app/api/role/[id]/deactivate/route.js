import { NextResponse } from "next/server";
import Role from "@/models/role";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/mongoose";

export async function PATCH(req, { params }) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // "activate" or "deactivate"

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Role ID is required" },
        { status: 400 }
      );
    }

    const role = await Role.findById(id);
    if (!role) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }

    if (action === "activate") {
      if (role.isActive) {
        return NextResponse.json(
          { success: false, message: "Role is already active" },
          { status: 400 }
        );
      }
      role.isActive = true;
    } else if (action === "deactivate") {
      if (!role.isActive) {
        return NextResponse.json(
          { success: false, message: "Role is already inactive" },
          { status: 400 }
        );
      }
      role.isActive = false;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action. Use 'activate' or 'deactivate'" },
        { status: 400 }
      );
    }

    await role.save();

    return NextResponse.json(
      {
        success: true,
        message: `Role '${role.roleName}' has been ${
          role.isActive ? "activated" : "deactivated"
        } successfully`,
        role,
      },
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
