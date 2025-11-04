import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import File from "@/models/project-resources/file";
import { verifyToken } from "@/lib/jwt";

export async function GET(req){
    const decoded = await verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:401}
        );
    }

    try{
        await connectDB();

        const files = await File.find();

        if(!files){
            return NextResponse.json(
                {success:false,message:"No files in database"},
                {status:404},
            );
        }

        return NextResponse.json(
            {success:true,data:files,message:"Files fetched successfully"},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}