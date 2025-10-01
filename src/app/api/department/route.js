// src/app/api/department/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Department from "@/models/department";

export async function GET() {
  try {
    await connectDB();

    const departments = await Department.find();

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("GET /api/department error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}




// ✅ POST new department
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.departmentName) {
      return NextResponse.json(
        { success: false, error: "departmentName is required" },
        { status: 400 }
      );
    }

    const newDepartment = await Department.create({
      departmentName: body.departmentName,
    });

    return NextResponse.json(
      { success: true, message: "Department created successfully", data: newDepartment },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/department error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}