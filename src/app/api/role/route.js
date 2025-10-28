'use server'

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Role from "@/models/role";
import { verifyToken } from "@/lib/jwt";



export async function GET() {
  await connectDB();

  try {
    // Aggregation to get roles along with member count
    const rolesWithCount = await Role.aggregate([
      {
        $lookup: {
          from: "members", // collection name in MongoDB is usually lowercase + plural
          localField: "_id",
          foreignField: "role",
          as: "members"
        }
      },
      {
        $addFields: {
          memberCount: { $size: "$members" } // count of members
        }
      },
      {
        $project: {
          members: 0 // remove members array, only keep count
        }
      }
    ]);

    return NextResponse.json({ success: true, roles: rolesWithCount }, { status: 200 });
  } catch (error) {
    console.error("❌ Role API error (GET):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// POST: Create a new role
export async function POST(req) {

  const decoded = verifyToken(req);
  if(!decoded){
    NextResponse.json(
      {success:false,error:"Unauthorized"},
      {status:404} 
    );
  }

  await connectDB();
    
  try {

    const body = await req.json();

    const {roleName,Permissions,isCopy,roleNameKey} = body;

    const role = await Role.create({ roleName, Permissions, isCopy,roleNameKey });

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