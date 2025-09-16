import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Role from "@/models/role";

// POST: Create a new role
export async function POST(req) {
  await connectDB();
    const { name, permissions } = await req.json();
  try {


    if (!name || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: "Role name and permissions array are required" },
        { status: 400 }
      );
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return NextResponse.json(
        { success: false, error: "Role already exists" },
        { status: 400 }
      );
    }

    const role = await Role.create({ name, permissions });

    return NextResponse.json(
      { success: true, message: "Role created successfully", role },
      { status: 201 }
    );
  } catch (error) {
    console.log("❌ Role API error (POST):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: List all roles
export async function GET() {
  await connectDB();

  try {
    const roles = await Role.find();
    return NextResponse.json({ success: true, roles }, { status: 200 });
  } catch (error) {
    console.error("❌ Role API error (GET):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
