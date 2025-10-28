import { NextResponse } from "next/server";
import Module from "@/models/module";
import connectDB from "@/lib/mongoose";

export  async function POST(req){
    try{
        await connectDB();
        const body = await req.json();

        const module = await Module.create(body);

        return NextResponse.json(
            {success:true,message:"Module created"},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        );
    }
}