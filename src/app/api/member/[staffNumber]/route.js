import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs"
import User from "@/models/user"


// function checkAuth(req){
//   const authHeader = req.headers.get("authorization");
//   if(!authHeader?.startsWith("Bearer")){
//     return { error: NextResponse.json({success:false,message:"Unauthorized:No token"},{status:401})}
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = verifyToken(token);

//   if(!decoded){
//     return {error:NextResponse.json(
//       {success:false,message:"Unauthorized"},
//       {status:401}
//     )}
//   }

//   if(!["admin","superadmin"].includes(decoded.role)){
//     return {
//       error:NextResponse.json(
//         {success:false,message:"Forbidden:Insufficient permission"},
//         {status:403}
//       )
//     }
//   }

//   return {user:decoded};
// }

//GET: Fetch single member byID
export async function GET(req,{params}){

  // const auth = checkAuth(req);
  // if(auth.error) return auth.error;

    try{

       const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
        await connectDB();

        const {staffNumber} =  await params;

        console.log("Staff",staffNumber);
        const member = await Member.findOne({staffNumber});

        if(!member){
            return NextResponse.json({success:false,message:"Member not found"},{status:404});
        }
        return NextResponse.json({success:true,data:member},{status:200});


    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to fetch member",error:error.member},
            {status:500}
        );
    }
}

export async function PUT(req, { params }) {
  try {
    // 🔹 Verify token
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { staffNumber } =  await params;
    const body = await req.json();

    // 🔹 Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // 🔹 Find & update Member
    const updatedMember = await Member.findOneAndUpdate(
      { staffNumber },
      body,
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 }
      );
    }

    // 🔹 Prepare User update data
    const userUpdateData = {
      name: body.name,
      email: body.email.toLowerCase(),
      phone_number: body.phone_number || updatedMember.phone,
      memberRole: updatedMember._id,
      role: "member",
    };

    if (body.password) {
      userUpdateData.password = await bcrypt.hash(body.password, 10);
    }

    // 🔹 Check for unique email
    const existingEmail = await User.findOne({
      email: body.email.toLowerCase(),
      memberRole: { $ne: updatedMember._id },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email is already in use" },
        { status: 400 }
      );
    }

    // 🔹 Check for unique phone_number
    if (body.phone_number) {
      const existingPhone = await User.findOne({
        phone_number: body.phone_number,
        memberRole: { $ne: updatedMember._id },
      });
      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: "Phone number is already in use" },
          { status: 400 }
        );
      }
    }

    // 🔹 Upsert User
    await User.findOneAndUpdate(
      { memberRole: updatedMember._id },
      userUpdateData,
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { success: true, message: "Member updated successfully", data: updatedMember },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update member", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {

  // const auth = checkAuth(req);
  // if(auth.error) return auth.error;
  try {

    // 🔹 Verify token
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    await connectDB();

    const {staffNumber} = await params;
    const deletedMember = await Member.findOneAndDelete({staffNumber});

    if (!deletedMember) {
      return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete member", error: error.message },
      { status: 500 }
    );
  }
}