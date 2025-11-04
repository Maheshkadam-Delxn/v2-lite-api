import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import BOQ from "@/models/project-resources/boq";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { name, type, category, sharedTo, description, projectId } = body;

    console.log("shraedto",sharedTo);
     
    if (!projectId || !name || !type)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    const boq = await BOQ.create({ name, type, category, sharedId, description, projectId });
    
    return NextResponse.json({ success: true, data: boq });
    
  } 
   
   catch (error) {
   return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  
  }
    
}
