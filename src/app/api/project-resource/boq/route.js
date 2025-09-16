import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import BOQ from '@/models/project-resources/boq'

export async function POST(req){
    try{
        await connectDB();
        const body = await req.json();
        const boq = await BOQ.create(body);
        return NextResponse.json(
            {success:true,data:boq},
            {status:201}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        )
    }
}


export async function GET(){
    try{
        await connectDB();
        const boqs = await BOQ.find().populate("sharedTo","name email")
        .populate("projectId","name code");

        return NextResponse.json({success:true,data:boqs},
            {status:200}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        )
    }
};