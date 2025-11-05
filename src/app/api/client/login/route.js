import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/project";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await connectDB();

  try {
    const { client_email, password } = await request.json();
    console.log(" Incoming login request:", { client_email, password });

    //  Find the project by email
    const project = await Project.findOne({ client_email });
    if (!project) {
      console.log(" No project found for:", client_email);
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    console.log(" Found project:", project.project_name);
    console.log(" Stored hashed password:", project.password);

    //  Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, project.password);
    console.log(" Password match result:", isMatch);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    //  Generate JWT Token
    const token = jwt.sign(
      { projectId: project._id, client_email: project.client_email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(" Login successful for:", client_email);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      project,
    });
  } catch (error) {
    console.error(" Login error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
