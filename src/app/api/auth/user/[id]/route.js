import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

export async function PATCH(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const body = await req.json();

    const user = await User.findByIdAndUpdate(id, body, { new: true });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





export async function POST(req) {
  await connectDB();

  try {
    const { name, email, mobile, password, roleId } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    let role = null;
    if (roleId) {
      role = await Role.findById(roleId);
      if (!role) {
        return NextResponse.json(
          { success: false, message: "Invalid roleId provided" },
          { status: 400 }
        );
      }
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: role ? role._id : null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
