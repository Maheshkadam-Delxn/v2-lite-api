import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/project";
import { verifyToken } from "@/lib/jwt";

// ✅ 6.1 Create new project
export async function POST(request) {
  
  try {

    const decoded = verifyToken(request);
      if(!decoded){
        return NextResponse.json(
          {success:false,error:"Unauhorized"},
          {status:401}
        );
      }

      await connectDB();
    const body = await request.json();
    console.log("Received body:", body); //  debug
    const project = await Project.create(body);

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("POST /api/projects error:", error); //  full error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ 6.2 Project listing (with filters)
export async function GET(request) {
  
  try {

   
      await connectDB();
   // grid or list (frontend choice)

    

    const projects = await Project.find();

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
