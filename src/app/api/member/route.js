import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";
import Role from "@/models/role";
import { verifyToken } from "@/lib/jwt";
<<<<<<< HEAD

import sendEmail from "@/utils/sendEmail";


// const requireAdmin = (req) =>{
//   const authHeader = req.headers.get("authorization");
//   if(!authHeader || !authHeader.startsWith("Bearer")){
//     return NextResponse.json(
//       {success:false,message:"Unauthorized: No token provided"},
//       {status:401}
//     );
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = verifyToken(token);

//   if(!decoded){
//     return NextResponse.json(
//       {success:false,message:"Unauthorized:Invalid token"},
//       {status:401}
//     );
//   }

//   if(!["admin","superadmin"].includes(decoded.role)){
//     return NextResponse.json(
//       {success:false,message:"Forbidden"},
//       {status:403}
//     );
//   }

//   return decoded;
// } 

//GET: Fetch all members
export async function GET(req){
  console.log("req",req);

  
    try{
      await connectDB();
        const {searchParams} = new URL(req.url);

        const sortField = searchParams.get("sort") || "createdAt";
        const sortOrder = searchParams.get("order") === "asc" ? 1:-1;

        const filter = {};
        ["name","email","staffNumber","designation","status"].forEach((field)=>{
          const value = searchParams.get(field);
          if(value) filter[field] = value;
        })

        const search = searchParams.get("search");
        if(search){
          filter.$or = [
            {name:{$regex:search,$options:"i"}},
            {email:{$regex:search,$options:"i"}},
            {staffNumber:{$regex:search,$options:"i"}},
            {designation:{$regex:search,$options:"i"}},
            {status:{$regex:search,$options:"i"}},
          ];
        }
        const members = await Member.find(filter).sort({[sortField]:sortOrder});

        console.log("member",members);
        return NextResponse.json({success:true,data:members},{status:200});
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to fetch members",error:error.message},
            {status:500}
        );
    }
}

/*
//POST: Create new member
=======
import Department from '@/models/department'
// POST: Create new member
>>>>>>> 020cad8a92dffc40b0d67e4723aa9e769b95c77d
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
<<<<<<< HEAD
*/










// 🧩 Add new member
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Create new member
    const member = await Member.create(body);

    // ✅ Prepare plain text email content
    const subject = "Welcome to Our Platform – Your Login Credentials";
    const text = `
Hello ${name || "Member"},

You have been successfully added to the system.

Here are your login credentials:
Email: ${email}
Password: ${password}

Please log in and update your password after your first login.

Best regards,
Admin Team
`;

    // ✅ Send email (no HTML)
    await sendEmail(email, subject, text);

    return NextResponse.json({
      success: true,
      message: "Member added successfully and email sent",
      data: member,
    });
  } catch (error) {
    console.error("POST /api/member error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
=======

 



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
>>>>>>> 020cad8a92dffc40b0d67e4723aa9e769b95c77d
