import connectDB from "@/lib/mongoose";
import Department from "@/models/department";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // connect to MongoDB
    await connectDB();

    // get request body
    const body = await req.json();
    const { departmentName } = body;

    // validation
    if (!departmentName || departmentName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Department name is required" },
        { status: 400 }
      );
    }

    // check if already exists
    const existing = await Department.findOne({ departmentName });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Department already exists" },
        { status: 400 }
      );
    }

    // create new department
    const newDepartment = await Department.create({ departmentName });

    return NextResponse.json(
      {
        success: true,
        message: "Department created successfully",
        data: newDepartment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create department" },
      { status: 500 }
    );
  }
}
