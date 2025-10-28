import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Department from "@/models/department";

// ✅ Update Department by ID (PUT)
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();
    console.log(body);
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Department name is required" },
        { status: 400 }
      );
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { departmentName:name },
      { new: true }
    );

    if (!updatedDepartment) {
      return NextResponse.json(
        { success: false, message: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedDepartment, message: "Department updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update department" },
      { status: 500 }
    );
  }
}

// ✅ Delete Department by ID (DELETE)
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return NextResponse.json(
        { success: false, message: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Department deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete department" },
      { status: 500 }
    );
  }
}
