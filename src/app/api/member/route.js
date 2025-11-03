import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";
import Role from "@/models/role";
import { verifyToken } from "@/lib/jwt";
import Department from '@/models/department'
// POST: Create new member
export async function POST(req) { 
  // Verify token
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    const { name, email, staffNumber, role } = body;

    // Basic validation
    if (!name || !email || !staffNumber || !role) {
      return NextResponse.json(
        { success: false, message: "Name, email, staff number, and role are required" },
        { status: 400 }
      );
    }

    // Fetch role by ID to get its permissions
    const selectedRole = await Role.findById(role);
    if (!selectedRole) {
      return NextResponse.json(
        { success: false, message: "Invalid role ID" },
        { status: 400 }
      );
    }

    // Create new member, copying role's permissions
    const newMember = await Member.create({
      ...body,
      Permissions: selectedRole.Permissions, // copy role permissions here
    });

    return NextResponse.json(
      { success: true, message: "Member created successfully", data: newMember },
      { status: 201 }
    );

  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate staffNumber or email" },
        { status: 400 }
      );
    }
    console.error("❌ Member creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create member", error: error.message },
      { status: 500 }
    );
  }
}

 



export async function GET(req) {
  try {
    await connectDB();

    // Fetch all members in reverse order
    const members = await Member.find().sort({ _id: -1 });

    // Fetch all departments once to avoid multiple DB calls
    const departments = await Department.find();

    // Create a lookup map for quick access
    const deptMap = {};
    departments.forEach((dept) => {
      deptMap[dept._id.toString()] = dept.departmentName;
    });
console.log(deptMap)
    // Replace department ID with department name
    const membersWithDeptName = members.map((member) => ({
      ...member.toObject(),
      departmentName: deptMap[member.department] || "Unknown Department",
    }));

    return NextResponse.json(
      { success: true, data: membersWithDeptName },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch members",
        error: error.message,
      },
      { status: 500 }
    );
  }
}