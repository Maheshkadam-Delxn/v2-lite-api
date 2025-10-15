import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Role from "@/models/role";
import { verifyToken } from "@/lib/jwt";

// POST: Create a new role
export async function POST(req) {

  const decoded = verifyToken(req);
  if(!decoded){
    NextResponse.json(
      {success:false,error:"Unauthorized"},
      {status:404} 
    );
  }

  await connectDB();
    
  try {

    const body = await req.json();

    const {name,keyName} = body;

    const role = await Role.create({ name, keyName });

    return NextResponse.json(
      { success: true, message: "Role created successfully", role },
      { status: 201 }
    );
  } catch (error) {
    console.log("❌ Role API error (POST):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: List all roles
export async function GET() {
  await connectDB();

  try {
    const roles = await Role.find();
    return NextResponse.json({ success: true, roles }, { status: 200 });
  } catch (error) {
    console.error("❌ Role API error (GET):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
