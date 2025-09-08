import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";


//GET: Fetch all members
export async function GET(){
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
  try {
    await connectDB();
    const body = await req.json();

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