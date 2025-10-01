import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";
import { verifyToken } from "@/lib/jwt";


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

  const decoded = verifyToken(req);
  if(!decoded){
    return NextResponse.json(
      {success:false,message:"Unauthorized"},
      {status:401}
    );
  }

    try{
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

  const decoded = verifyToken(req);
  if(!decoded){
    return NextResponse.json(
      {success:false,message:"Unauthorized"},
      {status:401}
    );
  }

  try {
    await connectDB();

    const {staffNumber} = await params;
    const body = await req.json();

    if(!body.name || !body.email){
      return NextResponse.json(
        {success:false,message:"Name and email are required"},
        {status:400}
      );
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)){
      return NextResponse.json(
        {success:false,message:"Invalid email format"},
        {status:400}
      );
    }

    const updatedMember = await Member.findOneAndUpdate({staffNumber}, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMember) {
      return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Member updated", data: updatedMember },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update member", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {

 const decoded = verifyToken(req);
  if(!decoded){
    return NextResponse.json(
      {success:false,message:"Unauthorized"},
      {status:401}
    );
  }
  try {
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