'use server'

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Role from "@/models/role";
import { verifyToken } from "@/lib/jwt";



export async function GET(req) {

  // const decoded = await verifyToken(req);
  // if (!decoded) {
  //   return NextResponse.json(
  //     { success: false, error: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

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

    return NextResponse.json({ success: true, data: rolesWithCount }, { status: 200 });
  } catch (error) {
    console.error("❌ Role API error (GET):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// POST: Create a new role
// export async function POST(req) {

//   const decoded = verifyToken(req);
//   if(!decoded){
//     NextResponse.json(
//       {success:false,error:"Unauthorized"},
//       {status:404} 
//     );
//   }

//   await connectDB();
    
//   try {

//     const body = await req.json();

//     const {roleName,Permissions,isCopy,roleNameKey} = body;

//     const role = await Role.create({ roleName, Permissions, isCopy,roleNameKey });

//     return NextResponse.json(
//       { success: true, message: "Role created successfully", role },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log("❌ Role API error (POST):", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


export async function POST(req) {
  const decoded = await verifyToken(req);
  console.log("Adsf",req);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const body = await req.json();
    const { roleName, Permissions, isCopy, roleNameKey } = body;

    

    let copiedPermissions = {};

    // If it's a copy, fetch parent role and clone its permissions
    if (isCopy?.status && isCopy?.ParentRole) {
      const parentRole = await Role.findById(isCopy.ParentRole);
      
      if (!parentRole) {
        return NextResponse.json(
          { success: false, error: "Parent role not found" },
          { status: 404 }
        );
      }
      copiedPermissions = parentRole.Permissions || {};
    }

    const role = await Role.create({
      roleName,
      roleNameKey,
      isCopy,
      Permissions: isCopy?.status ? copiedPermissions : Permissions || {},
    });

    return NextResponse.json(
      {
        success: true,
        message: isCopy?.status
          ? "Role copied successfully with parent permissions"
          : "Role created successfully (no permissions yet)",
        role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Role API error (POST):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}