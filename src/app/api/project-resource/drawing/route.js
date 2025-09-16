import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Drawing from '@/models/project-resources/drawing'

export async function POST(req){
    try{
        await connectDB();
        const body = await req.json();
        const drawing = await Drawing.create(body);

        return NextResponse.json(
            {success:true,data:drawing},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}

export async function GET() {
  try {
    await connectDB();
    const drawings = await Drawing.find().populate("projectId", "name code");
    return NextResponse.json({ success: true, data: drawings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}