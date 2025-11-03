import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";
import { verifyToken } from "@/lib/jwt";
// DELETE: Remove a member by ID
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
 const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Member ID is required" },
        { status: 400 }
      );
    }

    // Attempt to delete member
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Member deleted successfully", data: deletedMember },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Delete Member Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete member", error: error.message },
      { status: 500 }
    );
  }
}
