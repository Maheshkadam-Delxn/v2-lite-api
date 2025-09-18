import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";


//GET: Fetch single member byID
export async function GET(req,{params}){
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
  try {
    await connectDB();

    const {staffNumber} = await params;
    const body = await req.json();

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