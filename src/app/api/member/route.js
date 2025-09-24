import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";
import { verifyToken } from "@/lib/jwt";


const requireAdmin = (req) =>{
  const authHeader = req.headers.get("authorization");
  if(!authHeader || !authHeader.startsWith("Bearer")){
    return NextResponse.json(
      {success:false,message:"Unauthorized: No token provided"},
      {status:401}
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if(!decoded){
    return NextResponse.json(
      {success:false,message:"Unauthorized:Invalid token"},
      {status:401}
    );
  }

  if(!["admin","superadmin"].includes(decoded.role)){
    return NextResponse.json(
      {success:false,message:"Forbidden"},
      {status:403}
    );
  }

  return decoded;
} 

//GET: Fetch all members
export async function GET(req){

  const auth = requireAdmin(req);
  if(auth instanceof NextResponse) return auth;
    try{
        await connectDB();
        const members = await Member.find();
        return NextResponse.json({success:true,data:members},{status:200});
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to fetch members",error:error.message},
            {status:500}
        );
    }
}


//POST: Create new member
export async function POST(req) { 

  const auth = requireAdmin(req);
  if(auth instanceof NextResponse) return auth;

  try {
    await connectDB();
    const body = await req.json();

    if(!body.name || !body.email || !body.staffNumber){
      return NextResponse.json(
        {success:false,message:"Name , email, staff number required"},
        {status:400}
      );
    }

    const newMember = new Member(body);
    await newMember.save();

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
    return NextResponse.json(
      { success: false, message: "Failed to create member", error: error.message },
      { status: 500 }
    );
  }
}