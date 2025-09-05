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
