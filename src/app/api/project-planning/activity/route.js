import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import ActivitySchema from '@/models/project-planning/activity'
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
    try{

        const decoded = verifyToken(req);
        if(!decoded){
            return NextResponse.json(
                {success:false,message:"Unauthorized"},
                {status:401}
            );
        }

        await connectDB();

        const body = await req.json();
        const activity = await ActivitySchema.create(body);

        if(!activity){
            return NextResponse.json(
                {success:false,message:"Fields are missing"},
                {status:400}
            );
        }

        return NextResponse.json(
            {success:true,message:"Activity create successfully"},
            {status:200}
        );

    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}


export async function GET(req){

    console.log("Req",req);
    try{

        const decoded = verifyToken(req);
        if(!decoded){
            return NextResponse.json(
                {success:false,message:"Unauthorized"},
                {status:401}
            );
        }

        await connectDB();

        const body = await ActivitySchema.find();
        console.log("body",body);

        if(!body){
            return NextResponse.json(
                {success:true,message:"Activity not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:false,data:body},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}