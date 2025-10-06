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

// PUT /api/member/[staffNumber]
// export async function PUT(req, { params }) {
//   try {
//     const decoded = verifyToken(req);
//     if (!decoded) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     await connectDB();

//     const { staffNumber } = await params;
//     const body = await req.json();

//     // Update only member data
//     const updatedMember = await Member.findOneAndUpdate(
//       { staffNumber },
//       body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedMember) {
//       return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { success: true, message: "Member updated successfully", data: updatedMember },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to update member", error: error.message },
//       { status: 500 }
//     );
//   }
// }


// // PATCH /api/member/[staffNumber]/password
// export async function PATCH(req, { params }) {
//   try {
//     const decoded = verifyToken(req);
//     if (!decoded) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     await connectDB();

//     const { staffNumber } =  await params;
//     const body = await req.json();

//     if (!body.password) {
//       return NextResponse.json(
//         { success: false, message: "Password is required" },
//         { status: 400 }
//       );
//     }

//     const member = await Member.findOne({ staffNumber });
//     console.log("member",member);
//     if (!member) {
//       return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
//     }

//     const hashedPassword = await bcrypt.hash(body.password, 10);

//     // Update user linked to member
//     const updatedUser = await User.findOneAndUpdate(
//       { memberRole: member._id },
//       { password: hashedPassword },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json(
//         { success: false, message: "User not found for this member" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Password updated successfully" },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to update password", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// PUT /api/member/[staffNumber]
// PUT /api/member/[staffNumber]
export async function PUT(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { staffNumber } = params;
    const body = await req.json();

    // 🔹 Find existing member first
    const existingMember = await Member.findOne({ staffNumber });
    if (!existingMember) {
      return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
    }

    // 🔹 Check for duplicate email only if it was changed
    if (body.email && body.email !== existingMember.email) {
      const emailExists = await Member.findOne({ email: body.email });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: "Email already exists for another member" },
          { status: 400 }
        );
      }
    }

    // 🔹 Update Member
    const updatedMember = await Member.findOneAndUpdate(
      { staffNumber },
      body,
      { new: true, runValidators: true }
    );

    // 🔹 If password is provided → handle user
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const userData = {
        name: body.name || updatedMember.name,
        email: (body.email || updatedMember.email).toLowerCase(),
        phone_number: body.phone_number || updatedMember.phone_number,
        memberRole: updatedMember._id,
        role: "member",
        password: hashedPassword,
      };

      let user = await User.findOne({ memberRole: updatedMember._id });
      if (user) {
        await User.findOneAndUpdate({ memberRole: updatedMember._id }, userData, { new: true });
      } else {
        user = new User(userData);
        await user.save();
      }
    }

    return NextResponse.json(
      { success: true, message: "Member updated successfully", data: updatedMember },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", error);
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